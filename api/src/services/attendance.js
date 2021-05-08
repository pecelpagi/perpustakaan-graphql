import moment from 'moment';

const Attendance = require('../models/attendances');
const Member = require('../models/members');

export const getAttendances = async (args) => {
    let filter = {};

    if (args.search) {
        filter = {
            registration_number: new RegExp(args.search, "i"),
        }
    }

    if (args.member_id) {
        const member = await Member.findById(args.member_id);

        Object.assign(filter, { registration_number: member.registration_number });
    }

    let findData = Attendance.find(filter).sort('-attendance_date');

    if (args.skip) {
        findData = findData.skip(args.skip);
    }

    if (args.limit) {
        findData = findData.limit(args.limit);
    }

    const attendances = await findData;

    return attendances;
}

export const addAttendance = async (args) => {
    let filter = {
        registration_number: args.registration_number,
    };

    if (!args.registration_number) throw new Error("Nomor Induk wajib diisi");

    const findData = await Member.findOne(filter);
    if (!findData) {
        throw new Error("Nomor Induk tidak ditemukan");
    }

    const payload = {
        registration_number: args.registration_number,
        attendance_date: moment().format('YYYY-MM-DD'),
    };

    const isAttendanceExist = await Attendance.findOne(payload);

    if (isAttendanceExist) {
        const errMsg = `Kunjungan no induk ${payload.registration_number} pada tanggal ${moment().format('DD MMM YYYY')} sudah dicatat sebelumnya.`;
        throw new Error(errMsg);
    }

    const attendance = new Attendance(payload);
    const result = await attendance.save();

    return result;
}