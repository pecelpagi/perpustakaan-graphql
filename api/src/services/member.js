const Member = require('../models/members');

export const getRegistrationNumber = async () => {
    let findData = Member.findOne();

    findData = findData.sort('-registration_number');

    const res = await findData;

    if (!res) return '10121';

    return (parseInt(res.registration_number, 10) + 1);
}

export const getMembers = async (args) => {
    let filter = {};

    if (args.search) {
        filter = {
            code: new RegExp(args.search, "i"),
        }
    }

    let findData = Member.find(filter);
    
    if (args.skip) {
        findData = findData.skip(args.skip);
    }

    if (args.limit) {
        findData = findData.limit(args.limit);
    }

    const members = await findData;

    return members;
}

export const getMember = async (memberId) => {
    const member = await Member.findById(memberId);
    
    return member;
}

export const getMemberByRegistrationNumber = async (registrationNumber) => {
    const result = await Member.findOne({
        registration_number: registrationNumber
    });

    return result;
}

export const addMember = async (args) => {
    let retval = null;

    const filter = {
        registration_number: args.registration_number,
    };
    const findData = await Member.findOne(filter);
    if (findData) {
        throw new Error("Nomor induk sudah digunakan");
    }

    let member = new Member(args);
    retval = member.save();

    return retval;
}

export const updateMember = async (args) => {
    const result = await Member.findByIdAndUpdate(args.id, args);

    return result;
}

export const deleteMember = async (args) => {
    const result = await Member.findByIdAndRemove(args.id);
    
    return result;
}