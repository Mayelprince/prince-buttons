/**
 * prince-buttons - Professional WhatsApp Button Generator for Baileys
 * Simple, elegant, and powerful button generation for WhatsApp bots
 * 
 * @author Prince Tech
 * @license MIT
 * @version 1.0.0
 * @see https://github.com/PrinceTech-org/prince-buttons
 */

'use strict';

class PrinceButtons {
    /**
     * Create a new PrinceButtons instance
     * @param {Object} options - Configuration options
     * @param {boolean} options.viewOnce - Whether messages are view-once (default: true)
     * @param {number} options.headerType - Header type (default: 1)
     */
    constructor(options = {}) {
        this.config = {
            viewOnce: true,
            headerType: 1,
            ...options
        };
    }

    // ==================== CORE BUTTON GENERATORS ====================

    /**
     * Generate a quick reply button (Type 1)
     * @param {string} displayText - Text shown on button
     * @param {string} buttonId - Unique ID for button callback
     * @returns {Object} Formatted button object
     */
    quickReply(displayText, buttonId) {
        if (!displayText || !buttonId) {
            throw new Error('displayText and buttonId are required for quickReply');
        }

        return {
            buttonId: buttonId,
            buttonText: { displayText: displayText },
            type: 1 // REPLY_BUTTON_TYPE
        };
    }

    /**
     * Generate multiple quick reply buttons
     * @param {Array} buttons - Array of {text, id} objects
     * @returns {Array} Array of formatted quick reply buttons
     */
    quickReplies(buttons) {
        return buttons.map((btn, index) => 
            this.quickReply(btn.text, btn.id || `btn_${index + 1}`)
        );
    }

    /**
     * Generate a URL button (Type 2)
     * @param {string} displayText - Text shown on button
     * @param {string} url - URL to open when clicked
     * @returns {Object} Formatted URL button
     */
    urlButton(displayText, url) {
        if (!displayText || !url) {
            throw new Error('displayText and url are required for urlButton');
        }

        return {
            buttonId: `url_${Date.now()}`,
            buttonText: { displayText: displayText },
            type: 2, // URL_BUTTON_TYPE
            url: url
        };
    }

    /**
     * Generate multiple URL buttons
     * @param {Array} buttons - Array of {text, url} objects
     * @returns {Array} Array of formatted URL buttons
     */
    urlButtons(buttons) {
        return buttons.map(btn => this.urlButton(btn.text, btn.url));
    }

    /**
     * Generate a call button (Type 3)
     * @param {string} displayText - Text shown on button
     * @param {string} phoneNumber - Phone number to call
     * @returns {Object} Formatted call button
     */
    callButton(displayText, phoneNumber) {
        if (!displayText || !phoneNumber) {
            throw new Error('displayText and phoneNumber are required for callButton');
        }

        return {
            buttonId: `call_${Date.now()}`,
            buttonText: { displayText: displayText },
            type: 3, // CALL_BUTTON_TYPE
            phoneNumber: phoneNumber
        };
    }

    // ==================== LIST BUTTONS (Type 4) ====================

    /**
     * Generate a list/single-select button (Type 4)
     * @param {string} displayText - Text shown on button
     * @param {Object} listData - List configuration data
     * @param {string} buttonId - Custom button ID (optional)
     * @returns {Object} Formatted list button
     */
    listButton(displayText, listData, buttonId = null) {
        if (!displayText || !listData) {
            throw new Error('displayText and listData are required for listButton');
        }

        return {
            buttonId: buttonId || `list_${Date.now()}`,
            buttonText: { displayText: displayText },
            type: 4, // LIST_BUTTON_TYPE
            nativeFlowInfo: {
                name: "single_select",
                paramsJson: JSON.stringify(listData)
            }
        };
    }

    /**
     * Create list data structure
     * @param {string} title - Title of the list
     * @param {Array} sections - Array of sections
     * @returns {Object} Formatted list data
     */
    createListData(title, sections) {
        return {
            title: title || "Menu",
            sections: sections.map(section => ({
                title: section.title || "",
                rows: section.rows.map(row => ({
                    title: row.title || "",
                    description: row.description || "",
                    id: row.id || ""
                }))
            }))
        };
    }

    /**
     * Create a list row
     * @param {string} title - Row title
     * @param {string} description - Row description (optional)
     * @param {string} id - Row ID
     * @returns {Object} Formatted row
     */
    createRow(title, description = "", id = "") {
        return {
            title: title,
            description: description,
            id: id
        };
    }

    /**
     * Create a list section
     * @param {string} title - Section title (optional)
     * @param {Array} rows - Array of rows
     * @returns {Object} Formatted section
     */
    createSection(title = "", rows = []) {
        return {
            title: title,
            rows: rows
        };
    }

    // ==================== COMPLETE MESSAGE GENERATORS ====================

    /**
     * Generate a complete button message for baileys
     * @param {Object} options - Message options
     * @returns {Object} Complete message object
     */
    generateMessage(options) {
        const {
            body,
            footer = "",
            image = null,
            video = null,
            buttons = [],
            viewOnce = this.config.viewOnce,
            headerType = this.config.headerType
        } = options;

        if (!body) {
            throw new Error('body is required for generateMessage');
        }

        const message = {
            ...(image && { image: { url: image } }),
            ...(video && { video: { url: video } }),
            caption: body,
            footer: footer,
            viewOnce: viewOnce,
            headerType: headerType
        };

        if (buttons && buttons.length > 0) {
            message.buttons = buttons;
        }

        return message;
    }

    // ==================== SMART DETECTION ====================

    /**
     * Auto-detect button type from data
     * @param {Array} buttonsData - Array of button data objects
     * @returns {Array} Array of formatted buttons
     */
    autoDetect(buttonsData) {
        if (!Array.isArray(buttonsData)) {
            buttonsData = [buttonsData];
        }

        return buttonsData.map(btn => {
            // Check if already in correct format
            if (btn.type && [1, 2, 3, 4].includes(btn.type)) {
                return btn;
            }

            // Auto-detect by properties
            if (btn.url) {
                return this.urlButton(btn.text || btn.displayText, btn.url);
            } else if (btn.phone || btn.phoneNumber) {
                return this.callButton(btn.text || btn.displayText, btn.phone || btn.phoneNumber);
            } else if (btn.rows) {
                const listData = this.createListData(btn.title || "Options", [btn]);
                return this.listButton(btn.buttonText || "Select", listData);
            } else {
                return this.quickReply(btn.text || btn.displayText, btn.id || `btn_${Date.now()}`);
            }
        });
    }

    // ==================== PRE-BUILT BUTTON SETS ====================

    /**
     * Generate standard help buttons
     * @returns {Array} Array of help buttons
     */
    helpButtons() {
        return [
            this.quickReply("📜 Commands", "help_commands"),
            this.quickReply("❓ How to use", "help_usage"),
            this.urlButton("⭐ Star on GitHub", "https://github.com/PrinceTech-org"),
            this.quickReply("👨‍💻 Contact", "help_contact")
        ];
    }

    /**
     * Generate download buttons
     * @returns {Array} Array of download buttons
     */
    downloadButtons() {
        return [
            this.quickReply("🎬 Video", "download_video"),
            this.quickReply("🎵 Audio", "download_audio"),
            this.quickReply("📷 Image", "download_image"),
            this.quickReply("📄 Document", "download_doc")
        ];
    }

    /**
     * Generate social media buttons
     * @returns {Array} Array of social media buttons
     */
    socialButtons() {
        return [
            this.urlButton("📘 Facebook", "https://facebook.com/princetechn"),
            this.urlButton("📸 Instagram", "https://instagram.com/princetechn"),
            this.urlButton("🐦 Twitter", "https://twitter.com/princetechn"),
            this.urlButton("📹 YouTube", "https://youtube.com/princetechn")
        ];
    }

    /**
     * Generate menu navigation buttons
     * @returns {Array} Array of menu buttons
     */
    menuNavButtons() {
        return [
            this.quickReply("⬅️ Back", "menu_back"),
            this.quickReply("🏠 Home", "menu_home"),
            this.quickReply("🔄 Refresh", "menu_refresh"),
            this.quickReply("❌ Close", "menu_close")
        ];
    }
}

// ==================== CONVENIENCE FUNCTIONS ====================

/**
 * Quick reply button (Type 1)
 * @param {string} text - Button text
 * @param {string} id - Button ID
 * @returns {Object} Button object
 */
function quickReply(text, id) {
    return new PrinceButtons().quickReply(text, id);
}

/**
 * URL button (Type 2)
 * @param {string} text - Button text
 * @param {string} url - URL
 * @returns {Object} Button object
 */
function urlButton(text, url) {
    return new PrinceButtons().urlButton(text, url);
}

/**
 * Call button (Type 3)
 * @param {string} text - Button text
 * @param {string} phone - Phone number
 * @returns {Object} Button object
 */
function callButton(text, phone) {
    return new PrinceButtons().callButton(text, phone);
}

/**
 * List button (Type 4)
 * @param {string} text - Button text
 * @param {Object} listData - List data
 * @returns {Object} Button object
 */
function listButton(text, listData) {
    return new PrinceButtons().listButton(text, listData);
}

/**
 * Generate complete message
 * @param {Object} options - Message options
 * @returns {Object} Message object
 */
function generateMessage(options) {
    return new PrinceButtons().generateMessage(options);
}

/**
 * Auto-detect and generate buttons
 * @param {Array} buttons - Button data
 * @returns {Array} Formatted buttons
 */
function autoDetect(buttons) {
    return new PrinceButtons().autoDetect(buttons);
}

/**
 * Create list data
 * @param {string} title - List title
 * @param {Array} sections - Array of sections
 * @returns {Object} List data
 */
function createListData(title, sections) {
    return new PrinceButtons().createListData(title, sections);
}

// ==================== EXPORT EVERYTHING ====================

module.exports = {
    // Main class
    PrinceButtons,
    
    // Core functions
    quickReply,
    urlButton,
    callButton,
    listButton,
    generateMessage,
    autoDetect,
    createListData,
    
    // Pre-built sets
    helpButtons: () => new PrinceButtons().helpButtons(),
    downloadButtons: () => new PrinceButtons().downloadButtons(),
    socialButtons: () => new PrinceButtons().socialButtons(),
    menuNavButtons: () => new PrinceButtons().menuNavButtons(),
    
    // Aliases for convenience
    quick: quickReply,
    url: urlButton,
    call: callButton,
    list: listButton,
    generate: generateMessage,
    auto: autoDetect
};