const Setting = require('../models/settings');

const SETTING_ID = "6002613c7d1e3d54499662c3";

export const getSetting = async () => {
    const setting = await Setting.findById(SETTING_ID);
    return setting;
}

export const updateSetting = async (args) => {
    const result = await Setting.findByIdAndUpdate(SETTING_ID, args);
    
    return result;
}