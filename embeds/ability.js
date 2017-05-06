function embed(ability) {
    return {
        "author": {
            "name": ability.dname,
            "icon_url": `http://cdn.dota2.com${ability.img}`
        },
        "description": ability.desc,
        "fields": [
            {
                "name": `<:manacost:273535201337016320> ${ability.mc ? (Array.isArray(ability.mc) ? ability.mc.join(" / ") : ability.mc) : "Passive"}`,
                "value": ability.attrib.map((a) => {
                    return `**${a.header || ""}** ${Array.isArray(a.value) ? a.value.join("/") : a.value} ${a.footer || ""}`
                }).join("\n"),
                "inline": true
            },
            {
                "name": `<:cooldown:273535146320199680> ${ability.cd ? (Array.isArray(ability.cd) ? ability.cd.join(" / ") : ability.cd) : "None"}`,
                "value": [
                    ability.behavior && `**Behavior:** ${Array.isArray(ability.behavior) ? ability.behavior.map((a) => a).join(", ") : ability.behavior}`,
                    ability.dmg_type && `**Damage Type:** ${ability.dmg_type}`,
                    ability.bkbpierce && `**Pierces BKB:** ${ability.bkbpierce}`
                ].map((a) => a).join("\n"),
                "inline": true
            }
        ]
    };
}

module.exports = embed;
