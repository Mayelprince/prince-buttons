/**
 * Basic examples for prince-buttons
 * Run with: node examples/basic.js
 */

const {
    quickReply,
    urlButton,
    callButton,
    listButton,
    createListData,
    generateMessage,
    autoDetect,
    helpButtons,
    downloadButtons
} = require('../index');

console.log('📦 PRINCE-BUTTONS - BASIC EXAMPLES\n');

// Example 1: Simple quick reply
console.log('1️⃣ Quick Reply Button:');
const qrButton = quickReply("Start Chat", "start_chat");
console.log(JSON.stringify(qrButton, null, 2));

// Example 2: URL button
console.log('\n2️⃣ URL Button:');
const urlBtn = urlButton("Visit GitHub", "https://github.com/PrinceTech-org");
console.log(JSON.stringify(urlBtn, null, 2));

// Example 3: List button
console.log('\n3️⃣ List Button:');
const listData = createListData("Main Menu", [
    {
        title: "Bot Commands",
        rows: [
            { title: "🎮 Games", description: "Fun games", id: "games" },
            { title: "🔧 Tools", description: "Useful tools", id: "tools" },
            { title: "⚙️ Settings", description: "Bot settings", id: "settings" }
        ]
    }
]);
const listBtn = listButton("📂 Open Menu", listData);
console.log(JSON.stringify(listBtn, null, 2));

// Example 4: Complete message
console.log('\n4️⃣ Complete Message:');
const message = generateMessage({
    body: "Welcome to Prince Bot! 🤖\n\nSelect an option below:",
    footer: "Version 2.0 | Prince Tech © 2024",
    image: "https://princetechn.com/logo.png",
    buttons: [
        { text: "Commands", id: "menu_cmds" },
        { text: "Tutorial", url: "https://youtube.com/tutorial" },
        { text: "Support", id: "menu_support" }
    ]
});
console.log(JSON.stringify(message, null, 2));

// Example 5: Auto-detection
console.log('\n5️⃣ Auto-Detection:');
const autoButtons = autoDetect([
    { text: "Quick Reply", id: "qr1" },
    { text: "Open Website", url: "https://princetechn.com" },
    { text: "Call Support", phone: "+94712345678" }
]);
console.log('Detected buttons:', autoButtons);

// Example 6: Pre-built sets
console.log('\n6️⃣ Pre-built Button Sets:');
console.log('Help Buttons:', helpButtons());
console.log('Download Buttons:', downloadButtons());

console.log('\n✅ All examples executed successfully!');