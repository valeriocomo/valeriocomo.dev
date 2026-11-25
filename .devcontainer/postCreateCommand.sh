git config user.email \"valeriocomo@gmail.com\"
git config user.name \"Valerio Como\"

sudo chown -R node:node node_modules
sudo chown -R node:node .pnpm-store
sudo chown -R node:node /home/node/.claude

cp -r .devcontainer/scripts/git/pre-push .git/hooks
chmod +x .git/hooks/pre-push

pnpm install
pnpm setup
pnpm install -g localtunnel