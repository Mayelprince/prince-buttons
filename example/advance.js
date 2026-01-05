/**
 * Advanced examples for prince-buttons
 * Real-world usage with Baileys
 */

const { PrinceButtons, generateMessage, autoDetect } = require('../index');

console.log('🚀 PRINCE-BUTTONS - ADVANCED EXAMPLES\n');

// Create instance with custom config
const pb = new PrinceButtons({
    viewOnce: false,
    headerType: 1
});

// Real-world: Command menu for WhatsApp bot
function createCommandMenu(botName, prefix) {
    const sections = [
        {
            title: "📥 Download Commands",
            rows: [
                { title: "YouTube Video", description: "Download YouTube videos", id: `${prefix}ytdl` },
                { title: "Instagram Post", description: "Download Instagram content", id: `${prefix}igdl` },
                { title: "Facebook Video", description: "Download Facebook videos", id: `${prefix}fbdl` }
            ]
        },
        {
            title: "🔧 Utility Commands",
            rows: [
                { title: "Sticker Maker", description: "Create stickers from images", id: `${prefix}sticker` },
                { title: "QR Generator", description: "Generate QR codes", id: `${prefix}qr` },
                { title: "Text to Speech", description: "Convert text to audio", id: `${prefix}tts` }
            ]
        }
    ];

    const listData = pb.createListData(`${botName} Commands`, sections);
    
    return generateMessage({
        body: `🤖 ${botName.toUpperCase()} COMMAND MENU\n\nTotal commands: 6\nPrefix: ${prefix}\n\nSelect a category:`,
        footer: "Use arrow keys to navigate",
        buttons: [pb.listButton("📂 Open Command List", listData, "cmd_menu")]
    });
}

// Real-world: Help message with mixed buttons
function createHelpMessage(botName) {
    return generateMessage({
        body: `Need help with ${botName}?\n\nHere are some useful options:`,
        footer: "Select an option below",
        buttons: autoDetect([
            { text: "📜 Command List", id: "help_commands" },
            { text: "🎥 Video Tutorial", url: "https://youtube.com/watch?v=..." },
            { text: "📖 Documentation", url: "https://docs.princetechn.com" },
            { text: "👥 Join Support", url: "https://chat.whatsapp.com/..." }
        ])
    });
}

// Real-world: Group management buttons
function createGroupAdminPanel() {
    return generateMessage({
        body: "👑 GROUP ADMIN PANEL\n\nManage your group with these tools:",
        footer: "Admin privileges required",
        buttons: pb.autoDetect([
            { text: "🚫 Kick User", id: "admin_kick" },
            { text: "🔇 Mute User", id: "admin_mute" },
            { text: "👑 Promote", id: "admin_promote" },
            { text: "📊 Group Info", id: "admin_info" },
            { text: "⚙️ Settings", id: "admin_settings" }
        ])
    });
}

// Simulate sending messages
console.log('📋 Example 1: Command Menu');
const menu = createCommandMenu("PRINCE MD", ".");
console.log(JSON.stringify(menu, null, 2));

console.log('\n📋 Example 2: Help Message');
const help = createHelpMessage("PRINCE MD");
console.log(JSON.stringify(help, null, 2));

console.log('\n📋 Example 3: Group Admin Panel');
const adminPanel = createGroupAdminPanel();
console.log(JSON.stringify(adminPanel, null, 2));

console.log('\n✅ Advanced examples ready for use with Baileys!');