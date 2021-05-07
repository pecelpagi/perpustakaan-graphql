const Queue = require('bull');
const jobQueue = new Queue('JOB_CALCULATE_BORROWING_FINE::TEST_1');

import * as borrowingService from './services/borrowing';

const JobType = {
    CALCULATE_BORROWING_FINE: "CALCULATE_BORROWING_FINE",
}

export const processJobs = () => {
    jobQueue.process(function(job, done){
        const { type } = job.data;
        console.log('JOB-TYPE: ', type);
        if (type === JobType.CALCULATE_BORROWING_FINE) {
            borrowingService.calculateFines(done)
        } else {
            done();
        }
    });
}

export const startCronJob = () => {
    jobQueue.add({ type: JobType.CALCULATE_BORROWING_FINE }, { repeat: { cron: '00 1 * * *' } });
}