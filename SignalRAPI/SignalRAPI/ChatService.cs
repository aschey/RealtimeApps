using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using SignalRAPI.hubs;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SignalRAPI
{
    public class ChatService : IHostedService
    {
        private IHubContext<ChatHub> _hubContext;

        public ChatService(IHubContext<ChatHub> hubContext) 
        {
            _hubContext = hubContext;
        }

        private async void OnUpdate()
        {
            var messages = await Redis.Read();
            foreach(var message in messages)
            {
                await _hubContext.Clients.Group(message.Values[0].Value).SendAsync("messageReceived", message.Id, message.Values[2].Name, message.Values[2].Value);
            }
            //await _hubContext.Clients.Group(messages[0].Values[0].Value).SendAsync("messageReceived", messages[0].Values[2].Name, messages[0].Values[2].Value);
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            Redis.Subscribe(OnUpdate);

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            Redis.Unsubscribe();
            return Task.CompletedTask;
        }
    }
}
