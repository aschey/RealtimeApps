using Polly;
using Polly.Retry;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace SignalRAPI
{
    public static class Redis
    {
        private static ConnectionMultiplexer _conn;

        private static Guid _consumerId;

        private static AsyncRetryPolicy _asyncPolicy;

        private static RetryPolicy _policy;

        public static void Initialize()
        {
            _conn = Connect();
            _consumerId = Guid.NewGuid();
            var result = _conn.GetDatabase().Execute("XGROUP", "CREATE", "messages", $"consumer-{_consumerId}", "$", "MKSTREAM");

            _asyncPolicy = Policy.Handle<Exception>().WaitAndRetryAsync(10, retryAttempt => TimeSpan.FromSeconds(3), onRetry: (exception, retryTime, retryCount, retryContext) =>
            {
                //_conn = Connect();
                Console.WriteLine($"Redis retry: {retryCount}");
            });

            _policy = Policy.Handle<Exception>().WaitAndRetry(10, retryAttempt => TimeSpan.FromSeconds(3), onRetry: (exception, retryTime, retryCount, retryContext) =>
            {
                //_conn = Connect();
                Console.WriteLine($"Redis retry: {retryCount}");
            });
        }

        private static ConnectionMultiplexer Connect()
        {
            var opt = new ConfigurationOptions { AllowAdmin = true };

            for (var i = 0; i < 6; i++)
            {
                opt.EndPoints.Add(EndPointCollection.TryParse($"localhost:700{i}"));
            }

            return ConnectionMultiplexer.Connect(opt);
        }

        public static void Subscribe(Action handler)
        {
            _policy.Execute(() =>
            {
                var sub = _conn.GetSubscriber();
                var db = _conn.GetDatabase();

                sub.Subscribe("update", (a, b) => handler());
            });
        }

        public static void Unsubscribe()
        {
            var sub = _conn.GetSubscriber();
            sub.Unsubscribe("update");
        }

        public static async Task<StreamEntry[]> Read()
        {
            return await _asyncPolicy.ExecuteAsync(async () =>
            {
                var db = _conn.GetDatabase();
                return await db.StreamReadGroupAsync("messages", $"consumer-{_consumerId}", $"consumer-{_consumerId}", ">");
                //return await db.StreamRangeAsync("messages", "-", "+", 1, Order.Descending);
            });
           
        }

        public static async Task<StreamEntry[]> ReadAll()
        {
   
            return await _asyncPolicy.ExecuteAsync(async () =>
            {
                var db = _conn.GetDatabase();
                //return await db.StreamReadGroupAsync("messages", $"consumer-{_consumerId}", $"consumer-{_consumerId}", ">");
                return await db.StreamRangeAsync("messages", "-", "+");
            });
        
            
        }

        public static async void Write(NameValueEntry[] fields)
        {
        
            await _asyncPolicy.ExecuteAsync(async () =>
            {
                var db = _conn.GetDatabase();
                await db.StreamAddAsync("messages", fields);
                var sub = _conn.GetSubscriber();
                await sub.PublishAsync("update", "");
            });
            
 
        }
    }
}
