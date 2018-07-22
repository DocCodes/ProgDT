'use babel'

import { CompositeDisposable } from 'atom'

export default {

  subscriptions: null,

  config: {
    utc: {
      title: 'Use UTC Time',
      description: 'Whether or not to use the UTC time, or your timezone. Enabling this will ignore your timezone.',
      type: 'boolean',
      default: false
    }
  },

  /**
  * The initializer for the package
  * @param  {State} state The state of Atom
  */
  activate (state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'progdt:date': () => this.date(false),
      'progdt:time': () => this.time(false),
      'progdt:datetime': () => this.datetime(false)
    }))
  },

  deactivate () {
    this.subscriptions.dispose()
  },

  /**
  * Gets the date part of the datetime
  * @param  {Boolean} ret            Whether or not to return or display the date
  * @param  {Date}    [d=new Date()] The date to extract the date from
  * @return {String}                 The date in YYYY-MM-DD
  */
  date (ret, d = new Date()) {
    let utc = atom.config.get('progdt.utc')
    let yyyy = utc ? d.getUTCFullYear() : d.getFullYear()
    let mm = utc ? d.getUTCMonth() : d.getMonth()
    let dd = utc ? d.getUTCDate() : d.getDate()
    yyyy = yyyy.toString()
    mm = (mm + 1).toString().padStart(2, '0')
    dd = dd.toString().padStart(2, '0')
    let compile = `${yyyy}-${mm}-${dd}`

    if (ret) {
      return compile
    } else {
      let editor
      if (editor = atom.workspace.getActiveTextEditor()) {
        editor.insertText(compile)
      }
    }
  },

  /**
  * Gets the time part of the datetime
  * @param  {Boolean} ret            Whether or not to return or display the time
  * @param  {Date}    [d=new Date()] The date to extract the time from
  * @return {String}                 The time in HH:MM:SS.FFF+TZ:00
  */
  time (ret, d = new Date()) {
    let compile
    let utc = atom.config.get('progdt.utc')
    let hh = utc ? d.getUTCHours() : d.getHours()
    let mm = utc ? d.getUTCMinutes() : d.getMinutes()
    let ss = utc ? d.getUTCSeconds() : d.getSeconds()
    let fff = utc ? d.getUTCMilliseconds() : d.getMilliseconds()

    hh = hh.toString().padStart(2, '0')
    mm = mm.toString().padStart(2, '0')
    ss = ss.toString().padStart(2, '0')
    fff = fff.toString().padStart(3, '0')
    if (utc) {
      compile = `${hh}:${mm}:${ss}.${fff}+00:00`
    } else {
      let tzRaw = d.getTimezoneOffset()
      let tzPre = tzRaw.toString().startsWith('-') ? '+' : '-'
      let tzHour = ((tzRaw - (tzRaw % 60)) / 60).toString().padStart(2, '0')
      let tzMinute = (Math.abs(tzRaw % 60)).toString().padStart(2, '0')
      compile = `${hh}:${mm}:${ss}.${fff}${tzPre}${tzHour}:${tzMinute}`
    }

    if (ret) {
      return compile
    } else {
      let editor
      if (editor = atom.workspace.getActiveTextEditor()) {
        editor.insertText(compile)
      }
    }
  },

  /**
  * Gets the entire datetime
  * @param  {Boolean} ret Whether or not to return or display the datetime
  * @return {String}      The datetime in YYYY-MM-DDTHH:MM:SS.FFF+TZ:00
  */
  datetime (ret) {
    let d = new Date()
    let compile = `${this.date(true, d)}T${this.time(true, d)}`

    if (ret) {
      return compile
    } else {
      let editor
      if (editor = atom.workspace.getActiveTextEditor()) {
        editor.insertText(compile)
      }
    }
  }

}
