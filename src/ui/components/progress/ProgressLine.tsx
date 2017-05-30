import * as React from 'react';

export interface ProgressLineProps {
    className?: string,
    percent?: number,
    prefixCls?: string,
    strokeColor?: string,
    strokeLinecap?: 'butt' | 'round' | 'square',
    strokeWidth?: number,
    style?: React.CSSProperties,
    trailColor?: string,
    trailWidth?: number,
}

export class ProgressLine extends React.Component<ProgressLineProps, {}> {
    static defaultProps: ProgressLineProps = {
        className: '',
        percent: 0,
        prefixCls: 'rc-progress',
        strokeColor: '#2db7f5',
        strokeLinecap: 'round',
        strokeWidth: 1,
        style: {},
        trailColor: '#D9D9D9',
        trailWidth: 1,
    }

    private prevTimeStamp: number;

    public path: SVGPathElement;

    constructor(props: ProgressLineProps, context) {
        super(props, context);
    }

    componentDidUpdate() {
        const now = Date.now();
        this.path.style.transitionDuration = '0.3s, 0.3s';
        if (this.prevTimeStamp && now - this.prevTimeStamp < 100) {
            this.path.style.transitionDuration = '0s, 0s';
        }

        this.prevTimeStamp = Date.now();
    }

    render() {
        const {
            className,
            percent,
            prefixCls,
            strokeColor,
            strokeLinecap,
            strokeWidth,
            style,
            trailColor,
            trailWidth,
            children,
            ...restProps,
        } = this.props;

        const pathStyle = {
            strokeDasharray: '100px, 100px',
            strokeDashoffset: `${(100 - percent)}px`,
            transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s linear',
        };

        const center = strokeWidth / 2;
        const right = 100 - (strokeWidth / 2);
        const pathString = `M ${strokeLinecap === 'round' ? center : 0},${center} L ${strokeLinecap === 'round' ? right : 100},${center}`;
        const viewBoxString = `0 0 100 ${strokeWidth}`;

        return (
            <svg className={`${prefixCls}-line ${className}`} viewBox={viewBoxString} preserveAspectRatio="none" style={style} {...restProps}>
                <path
                    className={`${prefixCls}-line-trail`}
                    d={pathString}
                    strokeLinecap={strokeLinecap}
                    stroke={trailColor}
                    strokeWidth={trailWidth || strokeWidth}
                    fillOpacity="0" />
                <path
                    className={`${prefixCls}-line-path`}
                    d={pathString}
                    strokeLinecap={strokeLinecap}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fillOpacity="0"
                    ref={(path) => { this.path = path; }}
                    style={pathStyle} />
            </svg>
        );
    }
}