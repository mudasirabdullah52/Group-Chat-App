const { CronJob } = require('cron');
const { Op } = require('sequelize');
const ChatHistory = require('../Models/groupChatModel');
const ArchivedChat = require('../Models/archiveGroupChat');
exports.job = new CronJob(
    '0 0 * * *',
    function () {
        console.log("Mudasir")
        archiveOldRecords();
    },
    null,
    false,
    'Asia/Kolkata'
);

async function archiveOldRecords() {
    try {
        const date = new Date();
        date.setDate(date.getDate() - 10);
        console.log(date);
        // Find records to archive
        const recordsToArchive = await ChatHistory.findAll({
            where: {
                createdAt: {
                    [Op.lt]: date,
                },
            },
        });

        // Archive records
        await Promise.all(
            recordsToArchive.map(async (record) => {
                console.log(record.date)

                await ArchivedChat.create({
                    id: record.id,
                    ImageUrl: record.ImageUrl,
                    isImage: record.isImage,
                    messageText: record.messageText,
                    currentTime: record.currentTime,
                    userId: record.userId,
                    groupId: record.groupId,
                    createdAt: record.createdAt,
                    updatedAt: record.updatedAt
                });
                await record.destroy();
            })
        );
        console.log('Old records archived successfully.');
    } catch (error) {
        console.error('Error archiving old records:', error);
    }
}