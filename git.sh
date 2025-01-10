git add .
echo what is this commit for?
read comment
git commit -m "${comment}"
git push origin main
git status