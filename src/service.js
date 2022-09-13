var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'SysAuto Backend',
  description: 'SysAuto Backend',
  script: 'C:\\inetpub\\wwwroot\\ApiSysAuto\\sysauto-backend\\src\\server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();