precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform vec3 primaryColor;
uniform float artType;

#define TWO_PI  6.283

vec2 random(vec2 p) {
    return fract(sin(vec2(dot(p,vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float map(float value, float beforeMin, float beforeMax, float afterMin, float afterMax) {
    return afterMin + (afterMax - afterMin) * ((value - beforeMin) / (beforeMax - beforeMin));
}

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float rect(vec2 uv, vec2 position, vec2 size) {
    vec4 rect = vec4(
    position.x - size.x / 2.0,
    position.y - size.y / 2.0,
    position.x + size.x / 2.0,
    position.y + size.y / 2.0
    );
    vec2 hv = step(rect.xy, uv) * step(uv, rect.zw);
    return hv.x * hv.y;
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

    vec3 color = vec3(1.0, 0.0, 0.0);

    if (artType == 1.0) {
        uv.y += time * 0.15;

        float l = 10.0;
        vec2 id = floor(uv * l) / l;
        uv = id;

        float n = snoise(uv * 1.0 + time + uv.x);
        float f = step(0.5, length(n));
        color = vec3(f);
    } else if (artType == 2.0) {
        float l = 10.0;
        vec2 id = floor(uv * l) / l;
        uv *= (id + 10.0);
        vec2 id2 = floor(uv);
        uv = fract(uv);
        uv -= 0.5;
        float r = 0.35 * snoise(id2) + 0.15;
        float v = step(r, fract(time * 2.0 - snoise(id2)));
        color = vec3(v);
    } else if (artType == 3.0) {
        uv.x += time * 0.1;
        float l = 9.0;
        vec2 id = floor(uv * l) / l;
        float f1 = 5.0 * id.x;
        vec2 uv1 = floor(uv * f1) / f1;
        uv1 += rand(uv + time);

        float f2 = 2.0 * id.x;
        vec2 uv2 = floor(uv * f2) / f2;
        uv2 += rand(uv + time);

        float n1 = snoise(vec2(uv1.y, uv1.y * 0.1));
        float n2 = snoise(vec2(uv2.x * 0.1, uv2.x));
        float v = max(step(rand(uv1), n1), step(rand(uv2), n2));
        if (v == 0.0) {
            v = step(0.5, rand(uv)) * 0.9;
        }
        color = vec3(v);
    } else {
        float f = 20.0;
        uv = floor(uv * f) / f;
        float edge = smoothstep(1.0, 0.0, abs(length(uv.x))) * smoothstep(2.0, 0.0, abs(length(uv.y)));
        edge = 1.0;

        float _t = 0.08;
        vec2 t = vec2(cos(time * _t) * edge, sin(time * _t) * edge);

        uv.y += snoise(uv + t);
        uv.x += snoise(uv);
        float noise = snoise(vec2(uv * 2.0 + t));

        vec3 c0 = vec3(0, 240, 0);  // main
        vec3 c1 = vec3(27, 100, 242);  // point1
        vec3 c2 = vec3(4, 247, 198);  // point2
        vec3 c3 = vec3(232, 15, 115);  // point3
        vec3 c4 = vec3(220, 220, 220);  // background

        color = c0;

        if (noise > -0.2) {
            color.rgb = c1;
        }
        if (noise > -0.1) {
            color.rgb = c2;
        }
        if (noise > -0.05) {
            color.rgb = c3;
        }
        if (noise > 0.0) {
            color.rgb = c4;
        }
        color = color / 255.0;
    }

    gl_FragColor = vec4(color, 1.0);
}