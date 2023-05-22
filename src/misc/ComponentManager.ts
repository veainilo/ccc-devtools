interface IComponentProp {
    name: string;
    key: string;
    custom?: boolean;
}

interface IComponentViewModel {
    props: IComponentProp[];
}

export class ComponentManager {
    static getViewModel(name: string, componentGetter: any) {
        // console.log(name)
        switch (name) {
            case 'cc.UITransform':
                return new CCUITransformModel(componentGetter);
            case 'cc.Label':
                return new CCLabelModel();
            case 'cc.Sprite':
                return new CCSpriteModel();
            default:
                return createComponentViewModel(componentGetter);;
        }
    }
}

function createComponentViewModel(componentGetter: () => object) {

    let keys: string[] = []
    keys = keys.concat(Object.getOwnPropertyNames(componentGetter().constructor.prototype))
    keys = keys.concat(Object.getOwnPropertyNames(componentGetter()))

    // console.log(`keys = ${keys}`)


    class Auto implements IComponentViewModel {
        props: IComponentProp[] = [];
    }

    let auto = new Auto()
    for (let i = 1; i < keys.length; i++) {
        let key = keys[i]
        if (key.startsWith('_'))
            continue
        if (key == 'constructor')
            continue
        let propValue = componentGetter()[key]

        switch (typeof propValue) {
            case 'number':
            case 'string':
            case 'boolean':
            case 'symbol':
                auto.props.push({ name: key, key: key, custom: true });
                Object.defineProperty(Auto.prototype, key, {
                    get: function () {
                        return componentGetter()[key];
                    },
                    set: function (value) {
                        componentGetter()[key] = value;
                    }
                });
                break;
            case 'object':
                if (key != 'node') {
                    let child = createComponentViewModel(() => {
                        return componentGetter()[key]
                    })
                    child.props.forEach(prop => {
                        auto.props.push({ name: `${key}.${prop.name}`, key: `${key}.${prop.key}`, custom: true });
                        Object.defineProperty(Auto.prototype, `${key}.${prop.key}`, {
                            get: function () {
                                return prop.key in child ? child[prop.key] : null;
                            },
                            set: function (value) {
                                child[prop.key] = value
                            }
                        });
                    })
                }

                break
            case 'function':
            case 'undefined':
            case 'bigint':
            default:
                break
        }
    }

    return auto as IComponentViewModel;
}

class CCUITransformModel implements IComponentViewModel {

    private componentGetter: any;

    props: IComponentProp[] = [
        { name: 'Width', key: 'width', custom: true },
        { name: 'Height', key: 'height', custom: true },
        { name: 'Anchor X', key: 'anchorX', custom: true },
        { name: 'Anchor Y', key: 'anchorY', custom: true },
    ]

    constructor(componentGetter: any) {
        this.componentGetter = componentGetter;
    }

    get component(): any {
        return this.componentGetter();
    }

    get width() {
        return this.componentGetter().contentSize.width;
    }

    set width(value: number) {
        const origin = this.component.contentSize;
        this.component.setContentSize(value, origin.height);
    }

    get height() {
        return this.component.contentSize.height;
    }

    set height(value: number) {
        const origin = this.component.contentSize;
        this.component.setContentSize(origin.width, value);
    }

    get anchorX() {
        return this.component.anchorPoint.x;
    }

    set anchorX(value: number) {
        const origin = this.component.anchorPoint;
        this.component.setAnchorPoint(value, origin.y);
    }

    get anchorY() {
        return this.component.anchorPoint.y;
    }

    set anchorY(value: number) {
        const origin = this.component.anchorPoint;
        this.component.setAnchorPoint(origin.x, value);
    }

}

class CCLabelModel implements IComponentViewModel {

    props: IComponentProp[] = [
        { name: 'String', key: 'string' },
        { name: 'Color', key: 'color' },
        { name: 'Font Size', key: 'fontSize' },
        { name: 'Line Height', key: 'lineHeight' },
    ];

}

class CCSpriteModel implements IComponentViewModel {

    props: IComponentProp[] = [
        { name: 'Color', key: 'color' },
    ];

}