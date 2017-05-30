import * as React from 'react';
import * as classNames from 'classnames';
import { DEVICE_SIZES } from './StyleConfig';

export interface ColProps  {
    className?: string,
    style?: React.CSSProperties,
    componentClass?: React.ReactType,

    /**
     * The number of columns you wish to span for Extra small devices Phones (<768px)
     * class-prefix `col-xs-`
     */
    xs?: number,

    /**
     * The number of columns you wish to span for Small devices Tablets (≥768px)
     * class-prefix `col-sm-`
     */
    sm?: number,

    /**
     * The number of columns you wish to span for Medium devices Desktops (≥992px)
     * class-prefix `col-md-`
     */
    md?: number,
    
    /**
     * The number of columns you wish to span for Large devices Desktops (≥1200px)
     * class-prefix `col-lg-`
     */
    lg?: number,

    /**
     * Hide column on Extra small devices Phones
     * adds class `hidden-xs`
     */
    xsHidden?: boolean,

    /**
     * Hide column on Small devices Tablets
     * adds class `hidden-sm`
     */
    smHidden?: boolean,

    /**
     * Hide column on Medium devices Desktops
     * adds class `hidden-md`
     */
    mdHidden?: boolean,
    
    /**
     * Hide column on Large devices Desktops
     * adds class `hidden-lg`
     */
    lgHidden?: boolean,

    /**
     * Move columns to the right for Extra small devices Phones
     * class-prefix `col-xs-offset-`
     */
    xsOffset?: number,

    /**
     * Move columns to the right for Small devices Tablets
     * class-prefix `col-sm-offset-`
     */
    smOffset?: number,

    /**
     * Move columns to the right for Medium devices Desktops
     * class-prefix `col-md-offset-`
     */
    mdOffset?: number,

    /**
     * Move columns to the right for Large devices Desktops
     * class-prefix `col-lg-offset-`
     */
    lgOffset?: number,
    
    /**
     * Change the order of grid columns to the right for Extra small devices Phones
     * class-prefix `col-xs-push-`
     */
    xsPush?: number,

    /**
     * Change the order of grid columns to the right for Small devices Tablets
     * class-prefix `col-sm-push-`
     */
    smPush?: number,
    
    /**
     * Change the order of grid columns to the right for Medium devices Desktops
     * class-prefix `col-md-push-`
     */
    mdPush?: number,
    
    /**
     * Change the order of grid columns to the right for Large devices Desktops
     * class-prefix `col-lg-push-`
     */
    lgPush?: number,
    
    /**
     * Change the order of grid columns to the left for Extra small devices Phones
     * class-prefix `col-xs-pull-`
     */
    xsPull?: number,
    
    /**
     * Change the order of grid columns to the left for Small devices Tablets
     * class-prefix `col-sm-pull-`
     */
    smPull?: number,
    
    /**
     * Change the order of grid columns to the left for Medium devices Desktops
     * class-prefix `col-md-pull-`
     */
    mdPull?: number,

    /**
     * Change the order of grid columns to the left for Large devices Desktops
     * class-prefix `col-lg-pull-`
     */
    lgPull?: number,
}

export class Col extends React.Component<ColProps, {}> {
    public static defaultProps: ColProps = {
        componentClass: 'div'
    }
    
    constructor(props: ColProps, context) {
        super(props, context);
    }

    render() {
        const { componentClass: Component, className, style, ...props } = this.props;

        const classes = [];

        DEVICE_SIZES.forEach(size => {
            function popProp(propSuffix, modifier) {
                const propName = `${size}${propSuffix}`;
                const propValue = props[propName];

                if (propValue != null) {
                    classes.push(`col-${size}${modifier}-${propValue}`);
                }

                delete props[propName];
            }

            popProp('', '');
            popProp('Offset', '-offset');
            popProp('Push', '-push');
            popProp('Pull', '-pull');

            const hiddenPropName = `${size}Hidden`;
            if (props[hiddenPropName]) {
                classes.push(`hidden-${size}`);
            }

            delete props[hiddenPropName];
        });

        return (
            <Component className={classNames(classes, className)} style={style} {...props} />
        );    
    }
}