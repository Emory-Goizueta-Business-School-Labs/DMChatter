using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace DMChatter.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
