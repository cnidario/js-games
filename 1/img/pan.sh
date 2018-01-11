for f in *.jpg; do
    w=$(identify -format "%w" "$f");
    h=$(identify -format "%h" "$f");
    if [ "$w" -gt "$h" ]; then
        hh=$(( (w - h) / 2));
        convert "$f" -crop "$h"x"$h"+"$hh"+0 "$f";
    fi
done