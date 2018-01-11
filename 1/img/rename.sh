for i in orig/*.jpg; do
    new=$(printf "%02d.jpg" "$a");
    cp -- "$i" "$new";
    let a=a+1;
done