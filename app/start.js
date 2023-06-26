const exec = require('child_process').exec
exec('/usr/art.AppImage', (err, stdout) => {
  if (err) {
    console.log(err)
  }
  console.log(stdout)
})
