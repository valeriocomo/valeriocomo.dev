git config user.email \"valeriocomo@gmail.com\"

sudo chown -R node:node node_modules
sudo chown -R node:node .pnpm-store

cp .devcontainer/scripts/git .git/hooks

pnpm install