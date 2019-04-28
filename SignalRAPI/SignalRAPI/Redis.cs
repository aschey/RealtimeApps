using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SignalRAPI
{
    public static class Redis
    {
        private static ConnectionMultiplexer _conn;

        private static Guid _consumerId;
        public static void Initialize()
        {
            _conn = ConnectionMultiplexer.Connect("192.168.99.102");
            _consumerId = Guid.NewGuid();
        }

        public static void Subscribe(Action handler)
        {
            var sub = _conn.GetSubscriber();
            var db = _conn.GetDatabase();

            sub.Subscribe("update", (a, b) => handler());
        }

        public static void Unsubscribe()
        {
            var sub = _conn.GetSubscriber();
            sub.Unsubscribe("update");
        }

        public static async Task<StreamEntry[]> Read()
        {
            var db = _conn.GetDatabase();
            return await db.StreamReadGroupAsync("messages", "consumer", $"consumer-{_consumerId}", ">");
        }

        public static async void Write(NameValueEntry[] fields)
        {
            var db = _conn.GetDatabase();
            await db.StreamAddAsync("messages", fields);
            var sub = _conn.GetSubscriber();
            await sub.PublishAsync("update", "");
        }
    }
}
