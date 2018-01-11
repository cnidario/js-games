for i in *.jpg; do
    convert "$i" -resize 64x64 "$i";
done