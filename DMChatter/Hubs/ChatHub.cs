using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DMChatter.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        public static List<string> Users = new List<string>();
        public async override Task OnConnectedAsync()
        {
            Users.Add(Context.UserIdentifier);
            await Clients.User(Context.UserIdentifier).SendAsync("ReceiveRoster", Users);
            await Clients.AllExcept(Context.UserIdentifier).SendAsync("UserConnected", Context.UserIdentifier);
            await base.OnConnectedAsync();
            return;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Users.Remove(Context.UserIdentifier);
            await Clients.All.SendAsync("UserDisconnected", Context.UserIdentifier);
            await base.OnDisconnectedAsync(exception);
            return;
        }

        public async Task SendMessage(string targetUser, string message)
        {
            long timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            await Clients.User(targetUser).SendAsync("ReceiveMessage", timestamp, Context.UserIdentifier, message);
            await Clients.User(Context.UserIdentifier).SendAsync("MessageReceipt", timestamp, targetUser, message);
        }
    }
}
