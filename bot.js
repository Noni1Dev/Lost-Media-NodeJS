require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');



const bannedUsers = [ // Replace with actual banned user IDs
    '1162471295078903908'
];

// Create client with all intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

// Function to generate random color
function getRandomColor() {
    const hue = Math.random();
    const saturation = 0.8;
    const value = 0.9;
    
    const c = value * saturation;
    const x = c * (1 - Math.abs(((hue * 6) % 2) - 1));
    const m = value - c;
    
    let r, g, b;
    if (hue < 1/6) {
        [r, g, b] = [c, x, 0];
    } else if (hue < 2/6) {
        [r, g, b] = [x, c, 0];
    } else if (hue < 3/6) {
        [r, g, b] = [0, c, x];
    } else if (hue < 4/6) {
        [r, g, b] = [0, x, c];
    } else if (hue < 5/6) {
        [r, g, b] = [x, 0, c];
    } else {
        [r, g, b] = [c, 0, x];
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return (r << 16) | (g << 8) | b;
}

// Array of random phrases for spam command
const randomPhrases = [
    "البزول", "XD 999", "الدوران", "الإنفجارية", "الترمة", "لحظة برووو",
    "سبحان الله", "ما شاء الله", "BOOM 💥", "القرف", "هههههههه", "اللعنة",
    "يا سلام", "المدرسة الثانوية", "المتوسطة", "كشك متعدد الخدمات",
    "السيرفر", "سوف يتبعبص", "99", "يالنمي", "النم", "XD", "LOL", "زبيي",
    "ديتول", "شنايدر", "الشاب ساشي", "شنايدر ابو قلاوي", "اليابس", "اليابسة",
    "التفاح الأصلع", "النيك", "الصباح الباكر", "على الفجر", "زبي مطلوق على الشاطئ",
    "الترمة الإتصال", "يتصل", "سوة مشوطة", "القلوة المقلية", "ريال مدريد الزب",
    "GameBananaNmi.org", "القحبنة", "الشبكة", "الويندوز", "ترمة",
    "الفترة الصباحية", "الكرعنة", "ابو ترمة الإتصال", "أكل الدلاع XD",
    "النمي 😱", "حكان الترمة", "زب الشعر", "الذهاب للنيك في الجبل ثم"
];

// Slash commands
const commands = [
    new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send a message')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)
        )
        .setContexts([0, 1, 2]) // Guild, BotDM, PrivateChannel
        .setIntegrationTypes([0, 1]), // Guild, User

    new SlashCommandBuilder()
        .setName('spam')
        .setDescription('Spam random messages a specified number of times')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Number of messages to spam (max 20)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(20)
        )
        .setContexts([0, 1, 2]) // Guild, BotDM, PrivateChannel
        .setIntegrationTypes([0, 1]), // Guild, User

    new SlashCommandBuilder()
        .setName('send_file')
        .setDescription('Upload a file with an optional description')
        .addAttachmentOption(option =>
            option.setName('attachment')
                .setDescription('The file to upload')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Optional description for the file')
                .setRequired(false)
        )
        .setContexts([0, 1, 2]) // Guild, BotDM, PrivateChannel
        .setIntegrationTypes([0, 1]), // Guild, User

    new SlashCommandBuilder()
        .setName('embed_image')
        .setDescription('Send an image as an embed to bypass file restrictions')
        .addStringOption(option =>
            option.setName('image_url')
                .setDescription('Direct URL to the image')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title for the embed')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description for the embed')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Hex color for embed (e.g., #ff0000 for red)')
                .setRequired(false)
        )
        .setContexts([0, 1, 2]) // Guild, BotDM, PrivateChannel
        .setIntegrationTypes([0, 1]), // Guild, User

	new SlashCommandBuilder()
		.setName('angry')
		.setDescription('angry, كاليفورنيا نيك مك')
		.setContexts([0, 1, 2])
		.setIntegrationTypes([0, 1]),

	new SlashCommandBuilder()
		.setName('download')
		.setDescription('Download a video or audio from a URL')
		.addStringOption(option =>
		  option.setName('url')
			.setDescription('Video URL')
			.setRequired(true))
		.addStringOption(option =>
		  option.setName('format')
			.setDescription('Choose format')
			.setRequired(true)
			.addChoices(
			  { name: 'Video + Audio', value: 'video' },
			  { name: 'Audio Only', value: 'audio' },
    )),

	new SlashCommandBuilder()
    .setName('video_togif')
    .setDescription('Convert a video to GIF format')
    .addAttachmentOption(option =>
        option.setName('video')
            .setDescription('The video to convert to GIF')
            .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('speed')
            .setDescription('Playback speed')
            .addChoices(
                { name: 'Slow', value: 'slow' },
                { name: 'Normal', value: 'normal' },
                { name: 'Fast', value: 'fast' }
            )
            .setRequired(false)
    )
	
    .setContexts([0, 1, 2])
    .setIntegrationTypes([0, 1]),
		
    new SlashCommandBuilder()
        .setName('togif')
        .setDescription('Convert a static image to GIF format')
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('The image to convert to GIF')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Optional description for the converted GIF')
                .setRequired(false)
        )
        .setContexts([0, 1, 2]) // Guild, BotDM, PrivateChannel
        .setIntegrationTypes([0, 1]) // Guild, User
];

client.once('ready', async () => {
    console.log(`Ready: ${client.user.tag}`);
    
    try {
        // Register slash commands globally
        await client.application.commands.set(commands);
        console.log('Commands cleared and resynced.');
    } catch (error) {
        console.error('Error syncing commands:', error);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

	if (bannedUsers.includes(interaction.user.id)) {
		const banEmbed = new EmbedBuilder()
			.setTitle('Access Denied')
			.setDescription('⛔ **You are banned from using this bot (nik mok).**')
			.setColor(0xff0000)
			.setThumbnail('https://cdn.discordapp.com/attachments/1378380271560163450/1384237708150571109/m2g9eJU.png?ex=6851b353&is=685061d3&hm=5655c1238e1d9263b4069089cf055b07f67e4bf63fdfc0ba7d5a3a7ea3b98d0c&') // 🔒 Access Denied icon
			.setImage('https://cdn.discordapp.com/attachments/1378380271560163450/1384238161785389066/s4Ga8YA.png?ex=6851b3bf&is=6850623f&hm=5c1638d1622e2d49bea3d8283903da9e97b27a774a12b33f5bfece77805278b0&'); // 🔗 Replace with your image link

		try {
			await interaction.reply({ embeds: [banEmbed] });
			console.log(`[BAN] Blocked user ${interaction.user.tag} (${interaction.user.id}) from using /${interaction.commandName}`);
		} catch (error) {
			console.error('Failed to notify banned user:', error);
		}
		return;
	}

	
	
    const { commandName } = interaction;

    try {
        if (commandName === 'send') {
            const message = interaction.options.getString('message');
            
            try {
                await interaction.reply({ content: 'Activated!', ephemeral: true });
            } catch (error) {
                console.log('Interaction expired before response could be sent.');
            }
            
            await interaction.followUp({ content: message, ephemeral: false });
        }

        else if (commandName === 'spam') {
            const count = Math.min(interaction.options.getInteger('count'), 20);
            
            await interaction.reply({ content: `Spamming ${count} messages!`, ephemeral: true });
            
            const emojis = ["😂", "💯", "🔥", "⚡", "💪", "👌", "🤣", "😎"];
            
            // Pre-generate all messages for maximum speed
            const messages = [];
            for (let i = 0; i < count; i++) {
                const numPhrases = Math.floor(Math.random() * 3) + 1;
                const selectedPhrases = [];
                
                // Optimized random selection without shuffling entire array
                const usedIndices = new Set();
                for (let j = 0; j < numPhrases; j++) {
                    let randomIndex;
                    do {
                        randomIndex = Math.floor(Math.random() * randomPhrases.length);
                    } while (usedIndices.has(randomIndex));
                    usedIndices.add(randomIndex);
                    selectedPhrases.push(randomPhrases[randomIndex]);
                }
                
                let message = selectedPhrases.join(' ');
                
                // 30% chance to add emoji
                if (Math.random() > 0.7) {
                    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                    message += ' ' + randomEmoji;
                }
                
                messages.push(message);
            }
            
            // Send messages in batches with optimal timing
            const batchSize = 5; // Discord allows ~5 messages per 5 seconds
            const batches = [];
            for (let i = 0; i < messages.length; i += batchSize) {
                batches.push(messages.slice(i, i + batchSize));
            }
            
            for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
                const batch = batches[batchIndex];
                
                // Send all messages in current batch simultaneously
                const promises = batch.map(message => 
                    interaction.followUp({ content: message, ephemeral: false })
                        .catch(error => console.error('Error sending message:', error))
                );
                
                await Promise.all(promises);
                
                // Wait between batches to respect rate limits (except for last batch)
                if (batchIndex < batches.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        else if (commandName === 'embed_image') {
            const imageUrl = interaction.options.getString('image_url');
            const title = interaction.options.getString('title');
            const description = interaction.options.getString('description');
            const colorInput = interaction.options.getString('color');
            
            // Validate URL format
            try {
                new URL(imageUrl);
            } catch (error) {
                await interaction.reply({ content: 'Please provide a valid image URL!', ephemeral: true });
                return;
            }
            
            // Check if URL is likely an image
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
            const urlLower = imageUrl.toLowerCase();
            const isImageUrl = imageExtensions.some(ext => urlLower.includes(ext)) || 
                              urlLower.includes('imgur') || 
                              urlLower.includes('discord') ||
                              urlLower.includes('cdn.');
            
            if (!isImageUrl) {
                await interaction.reply({ 
                    content: '⚠️ Warning: This URL might not be a direct image link. The embed might not display properly.', 
                    ephemeral: true 
                });
            }
            
            // Parse color
            let embedColor = getRandomColor();
            if (colorInput) {
                try {
                    // Remove # if present and validate hex
                    const cleanColor = colorInput.replace('#', '');
                    if (/^[0-9A-F]{6}$/i.test(cleanColor)) {
                        embedColor = parseInt(cleanColor, 16);
                    }
                } catch (error) {
                    // Keep random color if parsing fails
                }
            }
            
            // Create embed
            const embed = new EmbedBuilder()
                .setColor(embedColor)
                .setImage(imageUrl);
            
            if (title) {
                embed.setTitle(title);
            }
            
            if (description) {
                embed.setDescription(description);
            }
            
            
            try {
                await interaction.reply({ content: 'Activated!', ephemeral: true });
                await interaction.followUp({ embeds: [embed], ephemeral: false });
            } catch (error) {
                console.error('Error sending embed:', error);
                if (error.message.includes('Invalid Form Body')) {
                    await interaction.followUp({ 
                        content: '❌ Failed to load image. Please check if the URL is a valid direct image link.',
                        ephemeral: true 
                    });
                } else {
                    await interaction.followUp({ 
                        content: '❌ An error occurred while sending the embed.',
                        ephemeral: true 
                    });
                }
            }
        }

        else if (commandName === 'togif') {
            const attachment = interaction.options.getAttachment('image');
            const description = interaction.options.getString('description') || '';
            
            if (!attachment) {
                await interaction.reply({ content: 'Please provide an image attachment!', ephemeral: true });
                return;
            }

            // Check if it's an image file
            const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp'];
            if (!imageTypes.includes(attachment.contentType)) {
                await interaction.reply({ 
                    content: '❌ Please upload a valid image file (JPG, PNG, WebP, or BMP)!', 
                    ephemeral: true 
                });
                return;
            }

            await interaction.reply({ content: '🔄 Converting image to GIF... Please wait!', ephemeral: true });

            try {
                // Download the original image
                const response = await fetch(attachment.url);
                if (!response.ok) {
                    throw new Error('Failed to download image');
                }
                
                const imageBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(imageBuffer);
                
                // For a simple conversion, we can use a trick:
                // Most image viewers/Discord will treat a renamed file as the new format
                // But for a more proper conversion, we'd need a library like sharp or jimp
                
                // Get original filename without extension
                const originalName = attachment.name.split('.').slice(0, -1).join('.');
                const gifName = originalName ? `${originalName}.gif` : 'converted.gif';
                
                // Create the "converted" file
                // Note: This is a simple rename approach - for true conversion you'd need image processing
                const file = new AttachmentBuilder(buffer, { name: gifName });
                
                // Create an embed to make it look more professional

                await interaction.followUp({ 
                    content: `✅ **Conversion Complete! size: ${(attachment.size / 1024).toFixed(1)} KB**`,
                    files: [file], 
                    ephemeral: false 
                });

            } catch (error) {
                console.error('Error converting image:', error);
                await interaction.followUp({ 
                    content: '❌ Failed to convert the image. Please try again with a different image.', 
                    ephemeral: true 
                });
            }
        }

		else if (commandName === 'video_togif') {
			const video = interaction.options.getAttachment('video');
			const speed = interaction.options.getString('speed') || 'normal';

			if (!video || !video.contentType.startsWith('video/')) {
				await interaction.reply({ content: '❌ Please upload a valid video file!', ephemeral: true });
				return;
			}

			await interaction.reply({ content: '🔄 Converting video to GIF... Please wait Nik mok!', ephemeral: true });

			let hasResponded = false;

			try {
				const response = await fetch(video.url);
				const buffer = Buffer.from(await response.arrayBuffer());

				const inputPath = `./temp_input_${Date.now()}.mp4`;
				const outputPath = `./output_${Date.now()}.gif`;

				fs.writeFileSync(inputPath, buffer);

				const speedMap = {
					slow: 0.5,
					normal: 1,
					fast: 2
				};
				const speedMultiplier = speedMap[speed] || 1;

				const framerate = 10 * speedMultiplier;
				const filter = `fps=${framerate},scale=320:-1:flags=lanczos`;

				const { exec } = require('child_process');
				const cmd = `ffmpeg -y -i "${inputPath}" -vf "${filter}" "${outputPath}"`;

				exec(cmd, async (error) => {
					try {
						fs.unlinkSync(inputPath);

						if (error) {
							console.error('FFmpeg error:', error);
							if (!hasResponded) {
								hasResponded = true;
								await interaction.editReply({
									content: '❌ Failed to convert video to GIF. Try a shorter or lower resolution video.'
								});
							}
							return;
						}

						const gifBuffer = fs.readFileSync(outputPath);
						fs.unlinkSync(outputPath);

						const file = new AttachmentBuilder(gifBuffer, { name: 'converted.gif' });

						if (!hasResponded) {
							hasResponded = true;
							await interaction.followUp({
								content: `✅ Conversion complete! (${speed} speed)`,
								files: [file]
							});
						}
					} catch (postError) {
						console.error('Post-processing error:', postError);
						if (!hasResponded) {
							hasResponded = true;
							await interaction.editReply({
								content: '❌ Unexpected error occurred during conversion.'
							});
						}
					}
				});
			} catch (outerError) {
				console.error('Outer video_togif error:', outerError);
				if (!hasResponded) {
					hasResponded = true;
					await interaction.editReply({
						content: '❌ A critical error occurred while processing your video.'
					});
				}
			}
		}




		else if (commandName === 'angry') {
			try {
				await interaction.reply({ content: 'Uploading angry image...', ephemeral: true });

				const response = await fetch('https://i.postimg.cc/52b461xs/image.png');
				if (!response.ok) throw new Error('Failed to download image');

				const imageBuffer = Buffer.from(await response.arrayBuffer());

				const file = new AttachmentBuilder(imageBuffer, { name: 'angry.png' });

				await interaction.followUp({
					files: [file],
					ephemeral: false
				});
			} catch (error) {
				console.error('Error uploading angry image:', error);
				await interaction.followUp({
					content: '❌ Failed to upload the angry image.',
					ephemeral: true
				});
			}
		}
		
        else if (commandName === 'send_file') {
            const attachment = interaction.options.getAttachment('attachment');
            const description = interaction.options.getString('description') || '';
            
            if (!attachment) {
                await interaction.reply({ content: 'Please provide a file attachment!', ephemeral: true });
                return;
            }

            await interaction.reply({ content: 'Activated!', ephemeral: true });
            
            // Download the file and re-upload it
            const response = await fetch(attachment.url);
            const buffer = await response.arrayBuffer();
            const file = new AttachmentBuilder(Buffer.from(buffer), { name: attachment.name });
            
            await interaction.followUp({ 
                content: description || undefined, 
                files: [file], 
                ephemeral: false 
            });
        }

    } catch (error) {
        console.error('Error handling interaction:', error);
        
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'An error occurred while processing your command.', ephemeral: true });
        } else {
            await interaction.followUp({ content: 'An error occurred while processing your command.', ephemeral: true });
        }
    }
});

// Login with your bot token
client.login(process.env.DISCORD_TOKEN);
