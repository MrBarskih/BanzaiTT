# BanzaiTT

This is a small TT in typeScript.

### Main task is: Make a system of booster packs.

1. Booster pack contains 5 items (Exception is fair pack);
2. Each item has: Name(string), Rarity(Common, Uncommon, Rare, Legendary), Type(Helmet, Armor, Weapon, Shield);
3. Types of booster pack: 
   - Common pack. It contains 5 random items. Rarity of 2 items equals pack's rarity and rarity of 3 item equals previous rarity;
   - Consistent pack. It is like common pack but can't contain more than 2 items with the same type (like 3 helmets for example or 3 weapons);
   - Fair pack. Max quantity of fair packs is 24. It means for 24 fair packs with rarity X player is to gain all items of rarity X.
4. Player inventory where gained items are stored;
5. Item storage from where packs take items.

P.S. 
>I didn't write code in typescript like 2-2.5 years in a row. So it could be a little bit dirty.
