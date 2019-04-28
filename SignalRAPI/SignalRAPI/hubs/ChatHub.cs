using Microsoft.AspNetCore.SignalR;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRAPI.hubs
{
    public class ChatHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public async Task JoinRoom(string roomName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
            GetAll(roomName);
        }

        public async Task LeaveRoom(string roomName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
        }

        public void NewMessage(string roomName, string username, string message)
        {
            var fields = new NameValueEntry[]
                {
                    new NameValueEntry("roomName", roomName),
                    new NameValueEntry("username", username),
                    new NameValueEntry("message", message),
                };
            Redis.Write(fields);
        }

        public void GetAll(string roomName)
        {
            var messages = Redis.ReadAll().Result;
            foreach(var message in messages)
            {
                if (message.Values[0].Value == roomName)
                {
                    Clients.Client(Context.ConnectionId).SendAsync("messageReceived", message.Id, message.Values[2].Name, message.Values[2].Value);
                }
            }
        }
    }
}
