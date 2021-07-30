namespace Rarities{
    export enum Type
    {
        Common = "Common",
        Uncommon = "Uncommon",
        Rare = "Rare",
        Legendary = "Legendary"
    }

    let ArrayOfRarities: Array<Rarities.Type> = 
    [
        Rarities.Type.Common,
        Rarities.Type.Uncommon,
        Rarities.Type.Rare,
        Rarities.Type.Legendary,
    ];
    
    export function GetPreviousRarity(rarity: Rarities.Type) : Rarities.Type
    {
        let indexOfRarity: number = GetIndexByRarity(rarity);
        if (indexOfRarity === 0)
        {
            console.log("There is no rarity lower than " + rarity);
        }
        else
        {
            return GetRarityByIndex(indexOfRarity - 1);
        }
        
    }
    export function GetRarityByIndex(index: number) : Rarities.Type
    {
        if(index > Rarities.GetLenght())
        {
            console.log("There is no rarity with index " + index);
        }
        else
        {
            return ArrayOfRarities[index];
        }   
    }

    export function GetIndexByRarity(rarity: Rarities.Type): number
    {
        let index: number = ArrayOfRarities.indexOf(rarity)
        if (index === undefined)
        {
            console.log("There is no index for rarity " + rarity);
        }
        else
        {
            return index;
        }   
    }

    export function TryToRiseRarity(item: Item)
    {
        let result: Rarities.Type = item.GetRarity();
        let indexOfRarity = GetIndexByRarity(item.GetRarity());

        if(indexOfRarity === (Rarities.GetLenght() - 1))
        {
            return;
        }

        let coinFlip: number = Math.random();
        let quantityOfRises: number = 0;        
        if(coinFlip < 0.1)
        {
            quantityOfRises++;
        }
        else
        {
            return;
        }
        if(coinFlip < 0.01)
        {
            quantityOfRises++;
        }
        if(coinFlip < 0.001)
        {
            quantityOfRises++;
        }
        if(coinFlip < 0.0001)
        {
            quantityOfRises++;
        }

        if (quantityOfRises > 0)
        { 
            do
            {
                result = GetRarityByIndex(indexOfRarity + quantityOfRises);
                quantityOfRises--;
            }
            while(result === undefined)
            item.SetRarity(result);
            item.Rename(); 
        }
    }

    export function GetLenght(): number
    {
        return ArrayOfRarities.length;
    }
}

namespace Equipment{
    export abstract class TypeOfEquipment
    {
        public abstract ToString(): string;
    }

    class Weapon extends TypeOfEquipment
    {   ToString()
        {
            return "Weapon";
        }
    }

    class Helmet extends TypeOfEquipment
    {
        ToString()
        {
            return "Helmet";
        }
    }

    class Armor extends TypeOfEquipment
    {
        ToString()
        {
            return "Armor";
        }
    }

    class Shield extends TypeOfEquipment
    {
        ToString()
        {
            return "Shield";
        }
    }

    export class EquipmentFactory
    {
        public CreateWeapon(): TypeOfEquipment
        {
            let result:TypeOfEquipment = new Weapon();
            return result;
        }

        public CreateHelmet(): TypeOfEquipment
        {
            let result:TypeOfEquipment = new Helmet();
            return result;
        }

        public CreateArmor(): TypeOfEquipment
        {
            let result:TypeOfEquipment = new Armor();
            return result;
        }

        public CreateShield(): TypeOfEquipment
        {
            let result:TypeOfEquipment = new Shield();
            return result;
        }
    }
}

namespace BoosterPacks
{
    export abstract class BoosterPack
    {
        protected rarity: Rarities.Type;
        protected items: Item[] = [];
        protected itemWarehouse: ItemWarehouse;
        protected isOpened: boolean = false;
        protected playerInventory: PlayerInventory;
        protected quantityOfRarityItems = 2;
        protected quantityOfPreviousRarityItmes = 3;

        public constructor(rarity: Rarities.Type, itemWareHouse: ItemWarehouse, playerInventory: PlayerInventory)
        {
            this.rarity = rarity;
            this.itemWarehouse = itemWareHouse;
            this.playerInventory = playerInventory;
        }

        public abstract OpenPack(): Item[];

        public GetRarity(): Rarities.Type
        {
            return this.rarity;
        }
        
        public ConsoleOutput()
        {
            console.log("Items in the pack is " + this.items.length);
            this.items.forEach(item => {
                console.log(item);
            });
        }

        protected CheckIfEnoughItems(rarity: Rarities.Type, previousRarity: Rarities.Type): boolean
        {
            let coutnOfItemsInWareHouse = this.itemWarehouse.GetItems().length;
            if (coutnOfItemsInWareHouse < 5)
            {
                console.log("At warehouse quantity of items is less than 5.");
                return false;
            }

            let countOfItems: number = this.itemWarehouse.GetCountOfItemsByRarity(rarity);
            if(countOfItems < this.quantityOfRarityItems)
            {
                console.log("There are no enough count of items with rarity " + rarity);
                return false;
            }
            
            countOfItems = this.itemWarehouse.GetCountOfItemsByRarity(previousRarity);
            if(countOfItems < this.quantityOfPreviousRarityItmes)
            {
                console.log("There are no enough count of items with rarity " + previousRarity);
                return false;
            }

            return true;
        }

        protected abstract AddItemToBoosterpackFromItemWarehouse(rarity: Rarities.Type): void; 
    }

    class CommonPack extends BoosterPack
    {
        public OpenPack(): Item[]
        {
            if (this.isOpened)
            {
                console.log("The pack is already opened");
                return [];
            }

            let previousRarity: Rarities.Type = Rarities.GetPreviousRarity(this.rarity);
            if (previousRarity === undefined)
            {
                console.log("Please, try open pack with next level of rarity.");
                return this.items;
            }

            let isEnoughItmes = this.CheckIfEnoughItems(this.rarity, previousRarity);

            if(isEnoughItmes)
            {
                for(let i = 0; i < 2; i++)
                {   
                    this.AddItemToBoosterpackFromItemWarehouse(this.rarity);                    
                }
                for(let i = 0; i < 3;i++)
                {
                    this.AddItemToBoosterpackFromItemWarehouse(previousRarity);
                }
                this.isOpened = true;
            }

            this.playerInventory.AddItems(this.items);
            return this.items;
        }

        protected AddItemToBoosterpackFromItemWarehouse(rarity: Rarities.Type): void {
            let item = this.itemWarehouse.GetAnItem(rarity);
            Rarities.TryToRiseRarity(item);
            this.items.push(item);
        }
    }

    class ConsistentPack extends BoosterPack
    {
        private bannedEquipmentType: Array<Equipment.TypeOfEquipment> = [];

        public OpenPack(): Item[] {
            
            if (this.isOpened)
            {
                console.log("The pack is already opened");
                return [];
            }

            let previousRarity: Rarities.Type = Rarities.GetPreviousRarity(this.rarity);
            if (previousRarity === undefined)
            {
                console.log("Please, try open pack with next level of rarity.");
                return this.items;
            }

            let isEnoughItmes = this.CheckIfEnoughItems(this.rarity, previousRarity);
            let canOpenPackSafely = this.ChekIfSafely(this.rarity, previousRarity);

            if ( isEnoughItmes && canOpenPackSafely )
            {      
                for( let i = 0; i < 2; i++ )
                {   
                    this.AddItemToBoosterpackFromItemWarehouse(this.rarity);
                }
                for( let i = 0; i < 3; i++ )
                {
                    this.AddItemToBoosterpackFromItemWarehouse(previousRarity);
                }
                this.isOpened = true;
            }

            this.playerInventory.AddItems(this.items);
            return this.items;
        }

        protected AddItemToBoosterpackFromItemWarehouse(rarity: Rarities.Type): void 
        {
            let item = this.itemWarehouse.GetAnUnbannedItem(rarity, this.bannedEquipmentType);

            Rarities.TryToRiseRarity(item);

            this.items.push(item);

            if ( this.items.length > 0 )
            {
                let quantityOfTypes: number = 0;
                this.items.forEach(itemInBoostrpack => {
                    if ( itemInBoostrpack.GetTypeOfEquipment().ToString() === item.GetTypeOfEquipment().ToString() )
                    {
                        quantityOfTypes++;
                    }
                });
                if ( quantityOfTypes === 2 )
                {
                    this.bannedEquipmentType.push( item.GetTypeOfEquipment() );
                }
            }
        }

        private ChekIfSafely(rarity: Rarities.Type,previousRarity: Rarities.Type): boolean
        {
            let variabilityOfTypesRarity = this.itemWarehouse.GetUniqueTypesOfItemsByRarity(rarity);
            let variabilityOfTypesPreviousRaritye = this.itemWarehouse.GetUniqueTypesOfItemsByRarity(previousRarity);
            let commonVariability: Equipment.TypeOfEquipment[] = [];

            if (variabilityOfTypesRarity.length === 0 || variabilityOfTypesPreviousRaritye.length < 2)
            {
                console.log("There is not enough variability in item warehouse for consistent pack.");
                return false;
            }

            if ( ( variabilityOfTypesRarity.length + variabilityOfTypesPreviousRaritye.length ) < 3 )
            {
                console.log("There is not enough variability in item warehouse for consistent pack.");
                return false;  
            }

            for(let i = 0; i < variabilityOfTypesRarity.length; i++)
            {
                for(let j = 0; j < variabilityOfTypesPreviousRaritye.length; j++)
                {
                    if(variabilityOfTypesRarity[i].ToString() === variabilityOfTypesPreviousRaritye[j].ToString())
                    {
                        commonVariability.push(variabilityOfTypesRarity[i]);
                    }
                }
            }

            let quantityOfUniqueTypes = variabilityOfTypesRarity.length + variabilityOfTypesPreviousRaritye.length - (commonVariability.length * 2);

            if ( ( commonVariability.length <= 2 ) && ( quantityOfUniqueTypes < 1 ) )
            {
                console.log("There is not enough variability in item warehouse for consistent pack.");
                return false; 
            }
            return true;
        }
    }

    class FairPack extends BoosterPack
    {   
        static openedUncommonPacks: number = 0;
        static openedRarePacks: number = 0;
        static openedLegendaryPacks: number = 0;

        public OpenPack(): Item[]
        {
            if (this.isOpened)
            {
                console.log("The pack is already opened");
                return [];
            }

            let openedFairPackWithRarity

            if (this.rarity === Rarities.Type.Uncommon)
            {
                openedFairPackWithRarity = FairPack.openedUncommonPacks;
            }
            else if (this.rarity === Rarities.Type.Rare) 
            {
                openedFairPackWithRarity = FairPack.openedRarePacks;
            }
            else if (this.rarity === Rarities.Type.Legendary)
            {
                openedFairPackWithRarity = FairPack.openedLegendaryPacks;
            }
            else
            {
                openedFairPackWithRarity = 2;
            }
            if(openedFairPackWithRarity === 24)
                {
                    console.log("Maximum of fair pack with rarity " + this.rarity + " was opened." );
                    return [];
                }

            let countOfItemsWithRarityInWarehouse = this.itemWarehouse.GetCountOfItemsByRarity(this.rarity);
            this.quantityOfRarityItems = Math.ceil(countOfItemsWithRarityInWarehouse / (24 - openedFairPackWithRarity));
            if (this.quantityOfRarityItems <= 2)
            {
                this.quantityOfRarityItems = 2;
            }
            let maxCardInPack = 5;
            this.quantityOfPreviousRarityItmes = maxCardInPack - this.quantityOfRarityItems;

            let previousRarity: Rarities.Type = Rarities.GetPreviousRarity(this.rarity);
            if (previousRarity === undefined)
            {
                console.log("Please, try open pack with next level of rarity.");
                return this.items;
            }

            let isEnoughItmes = this.CheckIfEnoughItems(this.rarity, previousRarity);

            if(isEnoughItmes)
            {
                for(let i = 0; i < this.quantityOfRarityItems; i++)
                {   
                    this.AddItemToBoosterpackFromItemWarehouse(this.rarity);                    
                }
                for(let i = 0; i < this.quantityOfPreviousRarityItmes;i++)
                {
                    this.AddItemToBoosterpackFromItemWarehouse(previousRarity);
                }
                this.isOpened = true;
                
                if (this.rarity === Rarities.Type.Uncommon)
                {
                    FairPack.openedUncommonPacks++;
                    console.log(FairPack.openedUncommonPacks);
                }
                else if (this.rarity === Rarities.Type.Rare) 
                {
                    FairPack.openedRarePacks++;
                    console.log(FairPack.openedRarePacks);
                }
                else if (this.rarity === Rarities.Type.Legendary)
                {
                    FairPack.openedLegendaryPacks++;
                    console.log(FairPack.openedLegendaryPacks);
                }
            }
            
            this.playerInventory.AddItems(this.items);
            return this.items;
        }

        protected AddItemToBoosterpackFromItemWarehouse(rarity: Rarities.Type): void {
            let item = this.itemWarehouse.GetAnItem(rarity);
            Rarities.TryToRiseRarity(item);
            this.items.push(item);
        }

    }

    export class BoosterPackFactory
    {
        public CreateCommonPack(rarity: Rarities.Type, itemWarehouse: ItemWarehouse, playerInventory: PlayerInventory): BoosterPack
        {
            let result: BoosterPack = new CommonPack(rarity, itemWarehouse, playerInventory);
            return result;
        }

        public CreateQuantityCommonPacks(rarity: Rarities.Type, itemWarehouse: ItemWarehouse, playerInventory: PlayerInventory, quantity: number): BoosterPack[]
        {
            let result: BoosterPack[] = [];

            for (let i = 0; i < quantity; i++)
            {
                result.push(this.CreateCommonPack(rarity, itemWarehouse, playerInventory));
            }

            return result;
        }

        public CreateConsistentPack(rarity: Rarities.Type, itemWareHouse: ItemWarehouse, playerInventory: PlayerInventory): BoosterPack
        {
            let result: BoosterPack = new ConsistentPack(rarity, itemWareHouse, playerInventory);
            return result;
        }

        public CreateQuantityConsistentPacks(rarity: Rarities.Type, itemWarehouse: ItemWarehouse, playerInventory: PlayerInventory, quantity: number): BoosterPack[]
        {
            let result: BoosterPack[] = [];

            for (let i = 0; i < quantity; i++)
            {
                result.push(this.CreateConsistentPack(rarity, itemWarehouse, playerInventory));
            }

            return result;
        }

        public CreateFairPack(rarity: Rarities.Type, itemWareHouse: ItemWarehouse, playerInventory: PlayerInventory): BoosterPack
        {
            let result: BoosterPack = new FairPack(rarity, itemWareHouse, playerInventory);
            return result;
        }

        public CreateQuantityFairPacks(rarity: Rarities.Type, itemWarehouse: ItemWarehouse, playerInventory: PlayerInventory, quantity: number): BoosterPack[]
        {
            let result: BoosterPack[] = [];

            for (let i = 0; i < quantity; i++)
            {
                result.push(this.CreateFairPack(rarity, itemWarehouse, playerInventory));
            }

            return result;
        }
    }
}

namespace SupportFunctions
{
    export function GetRandomInt(max: number) 
    {
        return Math.floor(Math.random() * max);
    }
    
    export function CreateQuantityItemsOfEachRarity(typeOfEqupment: Equipment.TypeOfEquipment, quantity: number) : Item[]
    {
        let result: Item[] = [];
        for (let i = 0; i < 4; i++)
        {
            for (let j = 0; j < quantity; j++)
            {
                let rarity = Rarities.GetRarityByIndex(i);
                let nameOfItem: string = rarity + " " + typeOfEqupment.ToString();
                let item: Item = new Item(nameOfItem, rarity, typeOfEqupment);
                result.push(item);
            }    
        }
        return result;
    }

    export function CreateAllItemsOfEachRarity(quantity: number): Item[]
    {
        let result: Item[] = [];
        let equipmentFactory = new Equipment.EquipmentFactory();

        result = result.concat(SupportFunctions.CreateQuantityItemsOfEachRarity(equipmentFactory.CreateWeapon(), quantity));
        result = result.concat(SupportFunctions.CreateQuantityItemsOfEachRarity(equipmentFactory.CreateHelmet(), quantity));
        result = result.concat(SupportFunctions.CreateQuantityItemsOfEachRarity(equipmentFactory.CreateArmor(), quantity));
        result = result.concat(SupportFunctions.CreateQuantityItemsOfEachRarity(equipmentFactory.CreateShield(), quantity));
        
        return result;
    }

}

class Item 
{
    private name: string;
    private rarity: Rarities.Type;
    private equipment: Equipment.TypeOfEquipment;

    public constructor(name: string, rarity: Rarities.Type, equipment: Equipment.TypeOfEquipment)
    {
        this.name = name;
        this.rarity = rarity;
        this.equipment = equipment;
    }

    public GetName(): string
    {
        return this.name;
    }

    public GetRarity(): Rarities.Type
    {
        return this.rarity;
    }

    public SetRarity(rarity: Rarities.Type)
    {
        this.rarity = rarity;
    }

    public GetTypeOfEquipment(): Equipment.TypeOfEquipment
    {
        return this.equipment;
    }    

    public Rename()
    {
        this.name = this.rarity + " " + this.equipment.ToString();
    }
}

class ItemWarehouse
{
    private items: Item[] = [];

    public AddItem(item: Item)
    {
        if (item)
        {
            this.items.push(item);
        }
        else
        {
            console.log("Trying to add undefined item");
        }
    
    }

    public AddItems(items: Item[])
    {
        if (items.length === 0)
        {
            console.log("Nothing was added the array is empty");
        }
        this.items = this.items.concat(items);
    
    }

    public GetItems(): Item[]
    {
        return this.items;
    }

    public GetAnItem(rarityOfItem: Rarities.Type): Item
    {
        let result: Item;

        this.ShuffleItems();

        for(let i = 0; i < this.items.length; i++)
        {
            if(rarityOfItem === this.items[i].GetRarity())
            {
                result = this.items[i]
                this.items.splice(i, 1);
                return result;
            }
        }

        console.log("There are no items with rarity " + rarityOfItem);
    }

    public GetAnUnbannedItem(rarity: Rarities.Type, bannedEquipment: Array<Equipment.TypeOfEquipment>): Item
    {
        let result: Item;

        this.ShuffleItems();

        for(let i = 0; i < this.items.length; i++)
        {
            if (this.items[i].GetRarity() === rarity)
            {
                let isBanned: boolean = false;
                for(let j = 0; j < bannedEquipment.length; j++)
                {
                    if(bannedEquipment[j].ToString() === this.items[i].GetTypeOfEquipment().ToString())
                    {
                        isBanned = true
                        break;
                    }
                }
                if (isBanned == false)
                {
                    result = this.items[i];
                    this.items.splice(i, 1);
                    return result;
                }
            }
        };

        console.log("There are no items with rarity " + rarity + " with suitable equipment type");
    }

    public GetCountOfItemsByRarity(rarity: Rarities.Type): number
    {
        let result: number = 0;
        for(let i = 0; i < this.items.length; i++)
        {
            if(this.items[i].GetRarity() === rarity)
            {
                result++;
            }       
        }
        return result;
    }

    public GetUniqueTypesOfItemsByRarity(rarity: Rarities.Type): Equipment.TypeOfEquipment[]
    {
        let result: Equipment.TypeOfEquipment[] = [];
        
        let count: number = 0;
        for ( let i = 0; i < this.items.length; i++)
        {
            if (this.items[i].GetRarity() === rarity)
            {
                if( count === 0 )
                {
                    result.push(this.items[i].GetTypeOfEquipment());
                    count++;
                }
                else
                {
                    let isUnique: boolean = true;
                    for (let j = 0; j < result.length; j++)
                    {
                        if( result[j].ToString() === this.items[i].GetTypeOfEquipment().ToString() )
                        {
                            isUnique = false;
                        }
                    }
                    
                    if (isUnique)
                    {
                        result.push(this.items[i].GetTypeOfEquipment());
                    }
                }
            }
        }

        return result;
    }

    public ShuffleItems() {
        let currentIndex: number = this.items.length;
        let randomIndex: number;

        while (0 !== currentIndex) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [this.items[currentIndex], this.items[randomIndex]] = [
            this.items[randomIndex], this.items[currentIndex]];
        }
    }

    public ConsoleOutput()
    {
        console.log("There is " + this.items.length + " items");
        this.items.forEach(item => {
        
            console.log(item);

        });
    }
}

class PlayerInventory
{
    private items: Item[] = [];

    public AddItem(item: Item)
    {
        if (item)
        {
            this.items.push(item);
        }
        else
        {
            console.log("Trying to add undefined item");
        }
    }

    public AddItems(items: Item[])
    {
        if (items.length === 0)
        {
            console.log("Nothing was added the array is empty");
        }
        this.items = this.items.concat(items);
    }

    public GetItems(): Item[]
    {
        return this.items;
    }
}





function main()
{
    let itemWarehouse: ItemWarehouse = new ItemWarehouse();
    let equipmetnFactory: Equipment.EquipmentFactory = new Equipment.EquipmentFactory();
    let boosterPackFactory = new BoosterPacks.BoosterPackFactory();
    let playerInventory = new PlayerInventory();

    let task: number = 1;
    switch(task)
    {
        case 1:
        {
            // Скрипт должен содержать базу из 32 предметов (по 2 каждой редкости каждого типа)
            itemWarehouse.AddItems(SupportFunctions.CreateAllItemsOfEachRarity(2)); 

            // Параметром функции является редкость бустерпака
            let commonPack = boosterPackFactory.CreateCommonPack(Rarities.Type.Uncommon, itemWarehouse, playerInventory);
            // Скрипт должен также содержать функцию, реализующую открытие бустерпака
            let result = commonPack.OpenPack();
            //Результатом должны быть 5 предметов, выдаваемых этим бустерпаком 
            console.log(result);

            break;
        }
        case 2: 
        {
            itemWarehouse.AddItems(SupportFunctions.CreateAllItemsOfEachRarity(2));

            //(consistent_pack), в котором не выдается более чем два предмета одинакового типа.
            let consistentPack = boosterPackFactory.CreateConsistentPack(Rarities.Type.Uncommon,itemWarehouse, playerInventory);
            let result = consistentPack.OpenPack();
            console.log(result);

            break;
        }

        case 3: 
        {
            itemWarehouse.AddItems(SupportFunctions.CreateAllItemsOfEachRarity(2));

            //(fair_pack) такой, чтобы игрок открыв максимум 24 таких бустерпака редкости X получил все предметы редкости X.
            let fairPack = boosterPackFactory.CreateFairPack(Rarities.Type.Uncommon, itemWarehouse, playerInventory);
            let result = fairPack.OpenPack();
            console.log(result);

            // Реализовать инвентарь игрока, где будут содержаться все полученные им предметы
            console.log(playerInventory);
            
            //Реализовать функцию выдачи N бустерпаков вида X (N, X - параметры)
            let tenCommonPacks = boosterPackFactory.CreateQuantityCommonPacks(Rarities.Type.Uncommon, itemWarehouse, playerInventory, 10);
            let tenConsistentPacks = boosterPackFactory.CreateQuantityFairPacks(Rarities.Type.Rare, itemWarehouse, playerInventory, 10);
            let tenFairPacks = boosterPackFactory.CreateQuantityConsistentPacks(Rarities.Type.Rare, itemWarehouse, playerInventory, 10);

            break;
        }
    }
}

main();