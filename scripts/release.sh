git stash
npm version patch
npm run build
git stash pop
git push origin new
npm publish --access=public