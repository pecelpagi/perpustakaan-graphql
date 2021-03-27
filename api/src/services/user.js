const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../models/users');
const Constants = require('../constants');

import { isHasProperty } from '../utils';

const SALT_ROUNDS = 10;
const SALT_PASSWD = bcrypt.genSaltSync(SALT_ROUNDS);

export const getUsers = async () => {
    const users = await User.find();

    return users;
}

export const updatePassword = async (args) => {
    const found = await User.findOne({ username: args.username });
    let data = {};
    let isPasswordValid = false;

    if (!found) throw new Error("User tidak ditemukan");

    isPasswordValid = bcrypt.compareSync(args.old_password, found.passwd);
    if (!isPasswordValid) throw new Error("Periksa kembali password lama anda");
    if (String(args.new_password) !== String(args.confirm_new_password)) throw new Error("Periksa kembali konfirmasi password baru anda");

    data = JSON.parse(JSON.stringify(found));
    delete data.passwd;

    if (isHasProperty(data, 'member_id')) {
        const member = await Member.findById(data.member_id);
        Object.assign(data, {
            fullname: member.name,
        });
    }

    await User.findByIdAndUpdate(data._id, {
        passwd: bcrypt.hashSync(args.new_password, SALT_PASSWD)
    });

    return data;
}

export const login = async (args) => {
    const found = await User.findOne({ username: args.username });
    let data = {};
    let isPasswordValid = false;

    if (!found) throw new Error("Username tidak ditemukan");

    if (found) {
        isPasswordValid = bcrypt.compareSync(args.password, found.passwd);
        data = found;

        delete data.passwd;
    }

    if (!isPasswordValid) throw new Error("Periksa kembali password anda");

    let retval = {
        "token": "",
        "username": "",
        "fullname": "",
    };

    if (isPasswordValid) {
        retval = {
            "token": jwt.sign({ data }, Constants.SECRET_KEY, { expiresIn: '17520h' }),
            "username": data.username,
            "fullname": data.fullname
        }
    }

    return retval;
}