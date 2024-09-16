module.exports = {
  apps: [{
    name: "wokedetector",
    script: './build/index.js',
    watch: '.',
    env: {
      PORT: 4000,
      ORIGIN: "https://wokedetector.cirnoslab.me",
      NODE_ENV: "production"
    }
  }],

  deploy: {
    production: {
      user: 'node',
      host: 'fubuki.cirnoslab.me',
      ref: 'origin/master',
      repo: 'git@github.com:supern64/wokedetector.git',
      path: '/var/www/wokedetector',
      key: 'deploy.key',
      
      'pre-deploy-local': '',
      'post-deploy' : 'chmod +x postdeploy.sh update.sh && ./postdeploy.sh',
      'pre-setup': ''
    }
  }
};
