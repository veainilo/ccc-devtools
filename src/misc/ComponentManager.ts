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
        console.log(name)
        return createComponentViewModel(componentGetter);
        // return createComponentViewModel(componentGetter);
        // switch (name) {
        //     case 'cc.UITransform':
        //         return new AudoComponentViewModel(componentGetter);
        //     case 'cc.Label':
        //         return new CCLabelModel();
        //     case 'cc.Sprite':
        //         return new CCSpriteModel();
        //     default:
        //         return null;
        // }
    }
}

class AudoComponentViewModel implements IComponentViewModel {
    componentGetter: any;
    get props(): IComponentProp[] {
        let component = this.componentGetter();

        let props: IComponentProp[] = [];

        for (let key in component) {
            if (key.startsWith('_'))
                continue;
            props.push({ name: key, key: key, custom: true });
        }
        console.log(props)
        return props;
    };

    constructor(componentGetter: any) {
        this.componentGetter = componentGetter;
    }
}

function createComponentViewModel(componentGetter: () => any) {

    let component = componentGetter();

    class Auto implements IComponentViewModel {
        props: IComponentProp[] = [];
    }

    let auto = new Auto()
    for (let key in component) {
        if (key.startsWith('_'))
            continue
        let propValue = component[key]

        console.log(typeof propValue)

        switch (typeof propValue) {
            case 'number':
            case 'string':
            case 'boolean':
            case 'symbol':
                auto.props.push({ name: key, key: key, custom: true });
                Object.defineProperty(Auto.prototype, key, {
                    get: function () {
                        return propValue;
                    },
                    set: function (value) {
                        component[key] = value;
                    }
                });
                break;
            case 'object':
            case 'function':
            case 'undefined':
            case 'bigint':
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