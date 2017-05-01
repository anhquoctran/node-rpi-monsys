function DateTimeProcessor() {
    this.getDateTimeNow = function() {
        return new Date().toISOString()
    }
}
module.exports = new DateTimeProcessor()