const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');
const { log, replPlugin } = require('mineflayer-repl');
const { SocksProxyAgent } = require('socks-proxy-agent');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const fetch = require('node-fetch');
const savedPlayerNames = [];
let continuousLook; // Variable to store the continuous look interval
let reconnectTimeout;
let isInteractingWithChest = false; // Flag to prevent concurrent chest interactions
let totalXP = 0; // Initialize total XP gained
let chestVisitInterval; // Interval for repeating chest visits
let generatorPosition;
let completedGames = 0;
let maxGames = 10;

// Define your proxy settings - SOCKS 5 PROXY
const proxy = {
    host: 'PROXYIPHERE',
    port: 12345,
    userId: 'PROXYUSERNAMEHERE',
    password: 'PROXYPASSWORDHERE'
};

// Create a SOCKS proxy agent with the specified settings
const proxyAgent = new SocksProxyAgent(`socks5://${proxy.userId}:${proxy.password}@${proxy.host}:${proxy.port}`);

function createBot() {
    const bot = mineflayer.createBot({
        host: 'mc.hypixel.net',
        username: 'EMAILHERE',
        auth: 'microsoft',
        version: '1.8.9',
        logErrors: true,
        //agent: proxyAgent, // Use the SOCKS proxy agent for the connection
    });

    bot.loadPlugin(pathfinder);

    function reconnectBot() {
        console.log('Reconnecting to the server...');
        bot.quit(); // Quit the existing bot instance
        clearTimeout(reconnectTimeout); // Clear any existing reconnect timeout
        reconnectTimeout = setTimeout(createBot, 30000); // 30000 milliseconds = 30 seconds
    }

    bot.once('end', () => {
        console.log('Bot disconnected from the server.');
        reconnectTimeout = setTimeout(reconnectBot, 30000); // 30000 milliseconds = 30 seconds
    });

    bot.once('login', () => {
        bot._client.on('packet', function (packet, packetMeta) {
            if (packetMeta.name.includes('disconnect')) {
                console.log('You were disconnected from the server...');
            }
        });
    });

    bot.once('spawn', async () => {
        // Reset all movement states to ensure the bot is stationary
        bot.clearControlStates(); // This clears any movement/control states, making the bot stationary

        await bot.waitForChunksToLoad();
        await sleep(2000);
        bot.chat('/play bedwars_two_four');
        updateWindowTitle(totalXP);
    });

    bot.on('message', async (message, chatPosition, sender) => {
		console.log(message.toAnsi());
		const msg = message.toString();
		if (msg.includes(': ')) {
			return;
		} else if (msg.includes('You were kicked for inactivity!')) {
			await sleep(5000);
			bot.chat('/rejoin');
		} else if (msg.includes('joined the lobby')) {
			stopBedwarsActivities(bot); // Pass the bot instance here
			// Reset all movement states to ensure the bot is stationary
			bot.clearControlStates(); // This clears any movement/control states, making the bot stationary
			bot.chat('/play bedwars_two_four ');
		} else if (msg.includes('You were spawned in limbo') || msg.includes('A kick occurred')) {
			bot.chat('/l');
		} else if (msg.includes('Protect your bed and destroy')) {
	savedPlayerNames.length = 0;
			// Reset all movement states to ensure the bot is stationary
			bot.clearControlStates(); // This clears any movement/control states, making the bot stationary
			await sleep(200);
			bot.setControlState('back', true);
			bot.setControlState('jump', true);
			await sleep(5000);
			bot.setControlState('back', false);
			bot.setControlState('jump', false);
			console.log('Walked backwards into generator...');
			generatorPosition = bot.entity.position.floored();
			const movements = new Movements(bot, require('minecraft-data')(bot.version));
			movements.canDig = false;
			movements.scaffoldingBlocks = [];
			bot.pathfinder.setMovements(movements);
			startBedwarsActivities(bot);
		} else if (msg.includes(bot.username) && msg.includes('FINAL KILL')) {
			stopBedwarsActivities(bot); // Pass the bot instance here
			// Reset all movement states to ensure the bot is stationary
			bot.clearControlStates(); // This clears any movement/control states, making the bot stationary
			if (completedGames <= maxGames) {
				completedGames++;
				bot.chat('/play bedwars_two_four');
			} else {
				bot.quit(); // Quit the existing bot instance
				await sleep(1800000);
				clearTimeout(reconnectTimeout); // Clear any existing reconnect timeout
				reconnectTimeout = setTimeout(createBot, 30000);
			}
			bot.chat('/play bedwars_two_four');
		} else if (msg.includes('Reward Summary')) {
			stopBedwarsActivities(bot);
			bot.clearControlStates();
			if (completedGames <= maxGames) {
				completedGames++;
				bot.chat('/play bedwars_two_four');
			} else {
				bot.quit(); // Quit the existing bot instance
				await sleep(1800000);
				clearTimeout(reconnectTimeout); // Clear any existing reconnect timeout
				reconnectTimeout = setTimeout(createBot, 30000);
			}

		} else if (msg.includes('+25 Bed Wars Experience (Time Played)')) {
			const xpGained = 25; // The XP amount gained from the message
			totalXP += xpGained; // Add the XP gained to the total
			updateWindowTitle(totalXP); // Update the command prompt window title with the new total XP
		}
    });

    replPlugin(bot);
    bot.repl.on('enter', function (command) {
        if (command === 'quit') {
            clearInterval(continuousLook);
            bot.quit();
        }
        bot.chat(command);
    });
}

function startBedwarsActivities(bot) {
    updateNearbyPlayers(bot);
    startLookingAtNearestPlayer(bot);

    setTimeout(() => {
        stopLookingAtPlayer();
        pathfindToNearestChestAndLook(bot);
    }, 5000);

    chestVisitInterval = setInterval(() => {
        stopLookingAtPlayer();
        pathfindToNearestChestAndLook(bot);
    }, 30000); // 60000 milliseconds = 1 minute
}

function stopBedwarsActivities(bot) {
    stopLookingAtPlayer();
    clearInterval(chestVisitInterval); // Clear the interval for chest visits
    if (bot && bot.pathfinder && bot.pathfinder.isMoving()) {
        bot.pathfinder.stop();
    }
    isInteractingWithChest = false; // Reset interaction flag
}

function updateWindowTitle(totalXP) {
    process.stdout.write(String.fromCharCode(27) + ']0;' + `Total XP Gained: ${totalXP}` + String.fromCharCode(7));
}

function updateNearbyPlayers(bot) {
    const nearbyPlayers = Object.values(bot.entities)
        .filter(e => e.type === 'player' && e !== bot.entity && bot.entity.position.distanceTo(e.position) <= 15)
        .map(player => {
            const helmet = player.equipment[4];
            if (helmet && helmet.name === 'leather_helmet') {
                return player;
            }
        })
        .filter(Boolean);

    savedPlayerNames.length = 0; // Clear previous player names
    nearbyPlayers.forEach(player => savedPlayerNames.push(player.username));
}

function stopLookingAtPlayer() {
    if (continuousLook) {
        clearInterval(continuousLook);
        continuousLook = null;
    }
}

async function pathfindToNearestChestAndLook(bot) {
    if (isInteractingWithChest) {
        console.log("Already interacting with a chest, skipping this attempt.");
        return;
    }

    isInteractingWithChest = true;

    let nearestChest = null;
    let nearestDistance = Infinity;
    const botPosition = bot.entity.position.floored();
    const mcData = require('minecraft-data')(bot.version);

    for (let x = -15; x <= 15; x++) {
        for (let y = -15; y <= 15; y++) {
            for (let z = -15; z <= 15; z++) {
                const checkPos = botPosition.offset(x, y, z);
                const block = bot.blockAt(checkPos);
                if (block && block.type === mcData.blocksByName.chest.id) {
                    const distance = botPosition.distanceTo(checkPos);
                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestChest = checkPos;
                    }
                }
            }
        }
    }

    if (nearestChest) {
        const movements = new Movements(bot, mcData);
        movements.canDig = false;
        movements.scaffoldingBlocks = [];
        bot.pathfinder.setMovements(movements);
        bot.pathfinder.setGoal(new GoalNear(nearestChest.x, nearestChest.y, nearestChest.z, 1));

        bot.once('goal_reached', async () => {
            await bot.lookAt(nearestChest.offset(0.5, 1.5, 0.5), true);
            const chestBlock = bot.blockAt(nearestChest);
            if (chestBlock) {
                try {
                    const chest = await bot.openChest(chestBlock);
                    await sleep(1000);
                    await depositItems(chest, 'iron_ingot', 64);
                    await depositItems(chest, 'gold_ingot', 64);
                    chest.close();
                    await bot.pathfinder.goto(new GoalNear(generatorPosition.x, generatorPosition.y, generatorPosition.z, 1));
                    startLookingAtNearestPlayer(bot);
                } catch (err) {
                    console.error('Failed to open chest:', err);
                }
            }
        });
    } else {
        console.log('No chest found within 15 blocks.');
    }

    isInteractingWithChest = false; // Reset the flag
}

async function depositItems(chest, itemName, depositAmount) {
    const itemsToDeposit = chest.items().filter(item => item.name === itemName);
    let totalDeposited = 0;

    for (const item of itemsToDeposit) {
        if (totalDeposited >= depositAmount) {
            break;
        }

        const depositCount = Math.min(depositAmount - totalDeposited, item.count);
        await chest.deposit(item.type, null, depositCount);
        console.log(`Deposited ${depositCount} ${itemName}`);
        await sleep(1000);
        totalDeposited += depositCount;
    }
	if (totalDeposited = 0) {
			findAndCollectItems(bot, 'iron_ingot', 15);
	}
}
async function findAndCollectItems(bot, itemName, maxDistance) {
    const itemsToCollect = bot.findBlocks({
        matching: bot.mcData.blocksByName[itemName].id,
        maxDistance,
        count: 15  // Maximum number of blocks to find
    });

    if (itemsToCollect.length === 0) {
        console.log(`No ${itemName} found nearby.`);
        return;
    }

    for (const item of itemsToCollect) {
        await bot.pathfinder.goto(item.position, { timeout: 10000 });
        console.log(`Collected ${itemName} at position: ${item.position}`);

        // Log the location of the collected items as the generator
        generatorPosition = item.position;
        console.log(`Location of the generator set to: ${generatorPosition}`);
    }
}
function countIronIngots(bot) {
    const ironIngots = bot.inventory.items().filter(item => item.name === 'iron_ingot');
    let totalIronIngots = 0;

    for (const ironIngot of ironIngots) {
        totalIronIngots += ironIngot.count;
    }

    return totalIronIngots;
}
function smoothLookAt(bot, targetPosition, steps = 5) {
    const interval = 200; // Time in milliseconds between updates
    let currentStep = 0;
    const maxPitchChangePerStep = Math.PI / 180 * 5; // Max pitch change per step, in radians (e.g., 5 degrees)

    const updateLook = () => {
        if (currentStep >= steps) {
            clearInterval(lookInterval); // Stop updating when we reach the desired step
            return;
        }

        const dx = targetPosition.x - bot.entity.position.x;
        const dy = targetPosition.y - bot.entity.position.y - 1.62; // Adjust for the bot's eye level
        const dz = targetPosition.z - bot.entity.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);

        let targetYaw = Math.atan2(-dx, -dz);
        let deltaYaw = normalizeAngle(targetYaw - bot.entity.yaw);

        let targetPitch = -Math.atan2(dy, distance);
        let deltaPitch = normalizeAngle(targetPitch - bot.entity.pitch);

        deltaPitch = Math.max(Math.min(deltaPitch, maxPitchChangePerStep), -maxPitchChangePerStep);

        bot.entity.yaw += deltaYaw * (currentStep / steps);
        bot.entity.pitch += deltaPitch;
        bot.look(bot.entity.yaw, bot.entity.pitch, true);

        currentStep++;
    };

    const lookInterval = setInterval(updateLook, interval);
}

function normalizeAngle(angle) {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
}

function startLookingAtNearestPlayer(bot) {
    if (continuousLook) clearInterval(continuousLook);

    continuousLook = setInterval(() => {
        let nearestPlayer = null;
        let nearestDistance = Infinity;

        savedPlayerNames.forEach(username => {
            const playerEntity = Object.values(bot.entities).find(entity => entity.username === username);
            if (playerEntity) {
                const distance = bot.entity.position.distanceTo(playerEntity.position);
                if (distance < nearestDistance && distance <= 4) {
                    nearestDistance = distance;
                    nearestPlayer = playerEntity;
                }
            }
        });

        if (nearestPlayer) {
            const targetPosition = nearestPlayer.position.offset(0, nearestPlayer.height, 0);
            smoothLookAt(bot, targetPosition);
        } else {
            const targetPosition = bot.entity.position.clone().set(0, bot.entity.position.y, 0);
            smoothLookAt(bot, targetPosition);
        }
    }, 1000);
}

createBot();
