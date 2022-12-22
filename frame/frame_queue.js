export const frame_queue = () => {
    return {
        recurring_jobs: [],
        queue: [],
        job: job => ({job: job, run: false}),
        dispatchRecurringJobs: function () {
            this.queue =
                this.queue.concat(this.recurring_jobs)
        },
        dispatchJob: function (func, shift = false) {
            let job = this.job(func)

            if (shift) this.queue.unshift(job)
            else this.queue.push(job)
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

