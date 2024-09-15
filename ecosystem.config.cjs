module.exports = {
  apps: [{
    name: "wokedetector",
    script: './build/index.js',
    watch: '.',
    env: {
      PORT: 4000,
      ORIGIN: "https://wokedetector.cirnoslab.me"
    }
  }],

  deploy: {
    production: {
      user: 'node',
      host: 'fubuki.cirnoslab.me',
      ref: 'origin/master',
      repo: 'git@github.com:supern64/wokedetector.git',
      path: '/var/www/wokedetector',
      
      'pre-deploy-local': '',
      'post-deploy' : 'cp ../.env . && /home/node/.bun/bin/bun install && /home/node/.bun/bin/bun run build && /home/node/.bun/bin/pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': '',
      ssh_options: "StrictHostKeyChecking=no",
    }
  }
};
