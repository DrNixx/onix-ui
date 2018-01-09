import * as React from 'react';
import * as classNames from 'classnames';
import { DEVICE_SIZES } from './StyleConfig';

export interface ColProps  {
    className?: string,
    style?: React.CSSProperties,
    componentClass?: React.ReactType,

    /**
     * The number of columns you wish to span for Extra small devices Phones (<576px)
     * class-prefix `col-`
     */
    xs?: number | 'auto',

    /**
     * The number of columns you wish to span for Small devices Tablets (≥576px)
     * class-prefix `col-sm-`
     */
    sm?: number | 'auto',

    /**
     * The number of columns you wish to span for Medium devices Desktops (≥768px)
     * class-prefix `col-md-`
     */
    md?: number | 'auto',
    
    /**
     * The number of columns you wish to span for Large devices Desktops (≥992px)
     * class-prefix `col-lg-`
     */
    lg?: number | 'auto',

    /**
     * The number of columns you wish to span for Extra large devices Desktops (≥1200px)
     * class-prefix `col-lg-`
     */
    xl?: number | 'auto',

    /**
     * Move columns to the right for Extra small devices Phones
     * class-prefix `offset-`
     */
    xsOffset?: number,

    /**
     * Move columns to the right for Small devices Tablets
     * class-prefix `offset-sm-`
     */
    smOffset?: number,

    /**
     * Move columns to the right for Medium devices Desktops
     * class-prefix `offset-md-`
     */
    mdOffset?: number,

    /**
     * Move columns to the right for Large devices Desktops
     * class-prefix `offset-lg-`
     */
    lgOffset?: number,

    /**
     * Move columns to the right for Extra large devices Desktops
     * class-prefix `offset-xl-`
     */
    xlOffset?: number,
    
    /**
     * Change the order of grid columns to the right for Extra small devices Phones
     * class-prefix `order-`
     */
    xsOrder?: number | 'first',

    /**
     * Change the order of grid columns to the right for Small devices Tablets
     * class-prefix `order-sm-`
     */
    smOrder?: number | 'first',
    
    /**
     * Change the order of grid columns to the right for Medium devices Desktops
     * class-prefix `order-md-`
     */
    mdOrder?: number | 'first',
    
    /**
     * Change the order of grid columns to the right for Large devices Desktops
     * class-prefix `order-lg-`
     */
    lgOrder?: number | 'first',

    /**
     * Change the order of grid columns to the right for Extra large devices Desktops
     * class-prefix `order-xl-`
     */
    xlOrder?: number | 'first',
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

                const sizeTag = (size == 'xs') ? "" : `${size}-`;

                if (propValue != null) {
                    if ((modifier == "col") && (propValue == 0)) {
                        classes.push(`${modifier}`);
                    } else {
                        classes.push(`${modifier}-${sizeTag}${propValue}`);
                    }
                }

                delete props[propName];
            }

            popProp('', 'col');
            popProp('Offset', 'offset');
            popProp('Order', 'order');
        });

        return (
            <Component className={classNames(classes, className)} style={style} {...props} />
        );    
    }
}