<div align="center">

<img src="https://imgur.com/wyfK8va.png" alt="Sunsi" style="width: 15%;" />

# Bedwars-Bot
A Bedwars Bot made for Hypixel, compatibility with Fours and Dreams modes. Has resource sharing, defense, failsafes, and requeuing. Coded in Macro / Keybind mod for 1.12.2 Liteloader + Forge. 
</div>

### What's the difference between V1 & V2?
- V1 has been tested for longer.
- V2 looks more legit + has pvp and bridging.

# Discord Server
### We now have a discord server! If you want to get help, suggest ideas, or collaborate with others, join here:
### discord.gg/sunsi

# Getting Started
### Video Tutorial (Credit: Toprak1337): https://youtu.be/O_39pO7w1F8

1. First, download and extract this repository.
2. Open the "Dependencies" folder, and install forge 1.12.2 if not installed already. (Make sure you have the Minecraft launcher installed).
3. Once finished installing, run the liteloader 1.12.2 installer, and click the "Extend from:" dropdown. Click 1.12.2 Forge.
4. Open the "BedwarsAFK" (or BedwarsAFKv2 depending on the version you downloaded) folder, which is inside of the Bedwars-Bot-main folder. Open the "liteconfig" folder, the "common" folder, then the "macros" folder.

#### Minecraft Launcher
1. First, download and extract this repository.
2. Open the "Dependencies" folder, and install forge 1.12.2 if not installed already. (Make sure you have the Minecraft launcher installed).
3. Once finished installing, run the liteloader 1.12.2 installer, and click the "Extend from:" dropdown. Click 1.12.2 Forge.
4. Copy the "liteconfig" and "mods" folders from "BedwarsAFK" (or BedwarsAFKv2 depending on the version you downloaded) into the ".minecraft" directory.
8. Open the Minecraft launcher. You should now have a profile in the Minecraft launcher called "release 1.12.2-LiteLoader1.12.2-1.12.2-forge..". In the top of the launcher, press on installations, then on that installation and you can run the game.

#### MultiMC / Prism Launcher
1. Begin by installing Forge 1.12.2 and LiteLoader. Navigate to "Add Instance," select version 1.12.2, choose Forge as the modloader, then confirm with "OK."
2. Once the installation is complete, select the instance and click "Edit." Proceed to click "Install Loader," choose LiteLoader, and confirm with "OK."
3. Thirdly, download and extract this repository.
6. Launch Prism Launcher. Select your instance and click "Folder." Then, double-click on ".minecraft" and copy the "liteconfig" and "mods" folders from "BedwarsAFK" (or BedwarsAFKv2 depending on the version you downloaded) into the ".minecraft" directory.
7. Finally, launch the game.

### 5a. CONFIGURATION FOR V1
Open "start.txt", and replace the IGN in quotations with your IGN. Save this file.

### 5b. CONFIGURATION FOR V2
Open "config.txt", and read through it. Replace the shop slots based on your own quickbuy (referencing the image).
- IF YOU ARE TOO LAZY, just copy the positions of the blocks, iron armor, iron sword, golden apple, and dream defender egg shown in the image into your quickbuy setup.
![inventorysetup](https://github.com/familiar/Bedwars-Bot/assets/136278435/852b8003-5717-457b-bd15-8837511a3a27)
   
6. This is OPTIONAL, but you can also open "command.txt" and replace the Bedwars play command with the one you want to queue. If you set it to dreams, your FKDR will not be affected.
7. Open the Minecraft launcher. You should now have a profile in the Minecraft launcher called "release 1.12.2-LiteLoader1.12.2-1.12.2-forge..". In the top of the launcher, press on installations, then on that installation.
8. Press on "Browser" for the game directory, and select the "BedwarsAFK" (or BedwarsAFKv2 depending on the version you downloaded) folder, which is inside of the Bedwars-Bot-main folder.
9. Click save, and then run the game.

# In-game Setup:

### IF YOU INSTALLED V2:
Make sure your hotbar layout is set to this:

![HotbarV2](https://github.com/familiar/Bedwars-Bot/assets/136278435/43f38063-12c5-4be0-9251-69f64ddae157)

#### IMPORTANT FOR V2 - IF YOU DO NOT DO THIS, THE BOT WILL BREAK:
Go into Minecraft settings -> controls, and set auto-jump to OFF.

### IF YOU INSTALLED V1:
Make sure your hotbar layout is set to this:

![HotbarV1](https://github.com/familiar/Bedwars-Bot/assets/136278435/0d550fa2-8734-4a4b-b409-8d3235456e59)

In game, make sure these are the slots your golden apples, iron golem spawn eggs, and iron armor is set to in the quick-buy:  

![QuickbuyV1](https://github.com/familiar/Bedwars-Bot/assets/136278435/a324deb5-7780-45ab-b3b3-db5c14f3563e)

### Also run /togglechat in game so others cannot abuse your bot and make it requeue. - FIXED in the newer version, reinstall if issue still happening.

# Usage / Keybinds
- Press up-arrow to start the bot. (Bot should automatically start on server join though.)
- Press "=" to stop the bot.
- You can use 5zig to Auto-Reconnect to the server. Set the delay to 30 seconds for safety.

### How do I keep my FKDR from dropping / How do I use the bot with dreams modes?
- Go into the "BedwarsAFK/liteconfig/common/macros" folder, and open the "Command.txt" file. Then, change the command to the current dreams gamemode of the week. Dreams DOES NOT affect FKDR, and only gives XP.
- If it's castle, I recommend not running the bot (or you could use the castle bot extra files I added, but those are rough draft / only work for the Ivory Castle map.) Use at your own risk!

### What is the "Bedwars Castle Extra Files" folder, and how do I use it?
This is the old Bedwars Castle function I created. This only works for the "Ivory Castles Map", and it was a very rough draft version, so USE at your own risk!!!
- To setup, just drag the .txt files in the "Bedwars Castle Extra Files" folder into the "BedwarsAFK/liteconfig/common/macros" folder, replacing the old ones. Should work.
- It goes to the generators based on spawn side (Red or Blue) and picks up resources. Then, it banks all of it's collected resources in the banker, using /banker.

### What is the "Extra Stuff" folder?  
- "Attack", "Pvp", and "Movement", is the old pvp function I added. It's kind of pieced together and unfinished, so don't bother with it. Just added it for fun, recreate it if you want.
- "Scared", and "Shout": For fun, I used to have the bot shout random lines in the start of a Bedwars game. (Shout.txt). I also had the bot, whenever it purchased iron armor, send a random message from "Scared.txt", telling it's teammates it was scared and was just going to stay at base all game. It was funny because people would actually respond to the bot.
- "bedwarschestbot.js": A simple bedwars mineflayer.js bot w/ SOCKS5 proxy support. Isn't as advanced as the macromod version, but it deposites resources into team chest, and runs as a command prompt terminal instead of game instance.
- These files don't work currently, you'll have to implement them yourselves.

# FAQ & Important Notes
Feel free to re-code or recreate my bot. You could also recode it in different languages, I don't mind. There are a lot of things that could be improved on to make the bot even better, but I only spent 2-3 days working on it. Never bothered to update it because it was the best Bedwars bot at the time, and the ban-chance was quite literally 0%.
- Even though I was NEVER banned using this bot, me publicing this code will probably lead to it's patch. This is intended to bring attention to the problem so it can be fixed. If you choose to use this and get punished, I am not responsible.
- I was always top 5 daily bedwars XP every day for MONTHS. Gained around <=7 stars a day. It was so obvious...
- I will NOT (maybe) be maintaining or updating this bot myself. However, you can use the discussions tab if you would like to. If I have the time, MAYBE i'll look at the responses and contribute...

# Why I was NEVER* banned
It isn't hard to bypass Hypixel while botting (I wish staff listened to my suggestions...):
- First, it would look at teammates at all times, making it look like a non in queue.
- Any non who sits in generator all game is obviously bad at the game. When I added resource dropping to teammates, I added a look delay. It makes the bot, in replays, look like it's on a trackpad.
- When it drops resources, it drops one at a time, not full stacks. This makes it look more legit in replays as it'll be constantly dropping resources to nearby teammates at all times. It only drops resources after it has purchased iron armor (this allows it to save for iron golems).
- It buys iron golems and eats golden apples. Have you seen a bedwars bot do that before?

P.S: I ran it 24/7. It can basically go infinitely without a ban. I stopped running it because my old PC blue-screened from running it for a month straight without any restarts.. Welp.

### Ban Status (Before Video):
![banstatus](https://github.com/familiar/Bedwars-Bot/assets/136278435/7dd0a19c-c4c3-4941-9a57-d6a659904b94)

*Sunsi was banned 1 day after my video was posted. Staff manually banned it (first staff macro-check in bedwars ever) after thousands of people saw the video. Was expected.

# Stats
My bot used to average 5+ normal KDR daily from iron golem spamming. It could usually survive for a while before dying:


### Couple of days - 1 Week of Running:
![MONTHLY](https://github.com/familiar/Bedwars-Bot/assets/136278435/fe13b261-5ed0-4e70-ae58-e41d55a8dfb4)

### 1/2 Months of Running:
![sunsi_daily_stats](https://github.com/familiar/Bedwars-Bot/assets/136278435/5045e073-0974-4bc4-916a-f8e8973b44d3)
