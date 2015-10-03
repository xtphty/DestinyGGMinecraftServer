screen -S hardcore -X stuff "say §6Allowing §6plebs §6into §6the §6server! ^M"
screen -S hardcore -X stuff "whitelist off ^M"

read -n1 -r -p "Press Y to continue (COUNTDOWN)..." key

if [ "$key" = 'Y' ]; then
        screen -S hardcore -X stuff "say §660 §6seconds §6to §6unfreeze ^M"
        sleep 10
        screen -S hardcore -X stuff "say §650 §6seconds §6to §6unfreeze ^M"
        sleep 10
        screen -S hardcore -X stuff "say §640 §6seconds §6to §6unfreeze ^M"
        sleep 10
        screen -S hardcore -X stuff "say §630 §6seconds §6to §6unfreeze ^M"
        sleep 10
        screen -S hardcore -X stuff "say §620 §6seconds §6to §6unfreeze ^M"
        sleep 10
        screen -S hardcore -X stuff "say §610 §6seconds §6to §6unfreeze ^M"
        sleep 5
        screen -S hardcore -X stuff "say §65 §6seconds §6to §6unfreeze ^M"
        sleep 4
        screen -S hardcore -X stuff "time set 0 ^M"
        sleep 1
        screen -S hardcore -X stuff "unfreezeall ^M"
        screen -S hardcore -X stuff "say §6Everyone §6is §6unfrozen §6GO! ^M"

        screen -S hardcore -X stuff "plugman enable scriptcraft ^M"
        screen -S hardcore -X stuff "say §6DEATH §6BANS §6ARE §6ENABLED! ^M"

        sleep 30
        screen -S hardcore -X stuff "say §630 §6seconds §6until §6PVP §6Protection §6DISABLED! ^M"

        sleep 30
        screen -S hardcore -X stuff "plugman disable NoobProtector ^M"
        screen -S hardcore -X stuff "say §6PVP §6Protection §6is §6now §6DISABLED! ^M"
else
    echo "wrong command!"
fi
