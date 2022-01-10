import { BoundingBox, Transform, Vector } from 'xyzt';

export const CONNECTION_DOT_SNAPRADIUS = 35;

export const DEFAULT_PLOT_BOUNDINGBOX = BoundingBox.fromTransform(
    Transform.fromObject({
        scale: new Vector(100, 100),
    }),
);
