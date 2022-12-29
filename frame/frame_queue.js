export const frame_queue = () => {
    return {
        recurring_jobs: [],
        queue: [],
        job: fn => ({job: fn, run: false}),
        dispatchRecurringJobs: function () {
            this.queue =
                this.queue.concat(this.recurring_jobs)
        },
        run: function () {
            this.dispatchRecurringJobs()
            this.queue.forEach(job => {
                job.job();
                job.run = true
            })
            this.queue = this.queue.filter(job => !job.run)
        }
    }
}
export const registerRecurringJobs = (frame_queue, jobs) => {
    frame_queue.recurring_jobs = [
        ...jobs.map(func => frame_queue.job(func)),
    ]
}

export const dispatchJob = (frame_queue, func, shift = false) => {
    let job = frame_queue.job(func)

    if (shift) frame_queue.queue.unshift(job)
    else frame_queue.queue.push(job)
}

