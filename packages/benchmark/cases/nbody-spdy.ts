function solarMass() {
    "use speedyjs";

    return 4 * Math.PI * Math.PI;
}

function daysPerYear() {
    "use speedyjs";
    return 365.24;
}

class Body {

    constructor(
        public x: number,
        public y: number,
        public z: number,
        public vx: number,
        public vy: number,
        public vz: number,
        public mass: number
    ) {
        "use speedyjs";
    }

    offsetMomentum(px: number, py: number, pz: number) {
        "use speedyjs";

        this.vx = -px / solarMass();
        this.vy = -py / solarMass();
        this.vz = -pz / solarMass();
    }
}

function Jupiter(): Body {
    "use speedyjs";

    return new Body(
        4.84143144246472090e+00,
        -1.16032004402742839e+00,
        -1.03622044471123109e-01,
        1.66007664274403694e-03 * daysPerYear(),
        7.69901118419740425e-03 * daysPerYear(),
        -6.90460016972063023e-05 * daysPerYear(),
        9.54791938424326609e-04 * solarMass()
    );
}

function Saturn(): Body {
    "use speedyjs";

    return new Body(
        8.34336671824457987e+00,
        4.12479856412430479e+00,
        -4.03523417114321381e-01,
        -2.76742510726862411e-03 * daysPerYear(),
        4.99852801234917238e-03 * daysPerYear(),
        2.30417297573763929e-05 * daysPerYear(),
        2.85885980666130812e-04 * solarMass()
    );
}

function Uranus(): Body {
    "use speedyjs";

    return new Body(
        1.28943695621391310e+01,
        -1.51111514016986312e+01,
        -2.23307578892655734e-01,
        2.96460137564761618e-03 * daysPerYear(),
        2.37847173959480950e-03 * daysPerYear(),
        -2.96589568540237556e-05 * daysPerYear(),
        4.36624404335156298e-05 * solarMass()
    );
}

function Neptune(): Body {
    "use speedyjs";

    return new Body(
        1.53796971148509165e+01,
        -2.59193146099879641e+01,
        1.79258772950371181e-01,
        2.68067772490389322e-03 * daysPerYear(),
        1.62824170038242295e-03 * daysPerYear(),
        -9.51592254519715870e-05 * daysPerYear(),
        5.15138902046611451e-05 * solarMass()
    );
}

function Sun(): Body {
    "use speedyjs";

    return new Body(
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, solarMass()
    );
}

class NBodySystem {
    private bodies: Body[];
    constructor(bodies: Body[]) {
        "use speedyjs";

        this.bodies = bodies;

        let px = 0.0;
        let py = 0.0;
        let pz = 0.0;

        for (let i: int = 0; i < bodies.length; i++) {
            px += bodies[i].vx * bodies[i].mass;
            py += bodies[i].vy * bodies[i].mass;
            pz += bodies[i].vz * bodies[i].mass;
        }

        this.bodies[0].offsetMomentum(px, py, pz);
    }

    advance(dt: number): void {
        "use speedyjs";

        for (let i = 0; i < this.bodies.length; ++i) {
            const bodyi = this.bodies[i];

            let bivx = bodyi.vx;
            let bivy = bodyi.vy;
            let bivz = bodyi.vz;

            for (let j = i + 1; j < this.bodies.length; ++j) {
                const bodyj = this.bodies[j];
                const dx = bodyi.x - bodyj.x;
                const dy = bodyi.y - bodyj.y;
                const dz = bodyi.z - bodyj.z;

                const distanceSq = Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2);
                const distance = Math.sqrt(distanceSq);
                const mag = dt / (distanceSq * distance);

                const bim = bodyi.mass * mag;
                const bjm = bodyj.mass * mag;

                bivx -= dx * bjm;
                bivy -= dy * bjm;
                bivz -= dz * bjm;

                bodyj.vx += dx * bim;
                bodyj.vy += dy * bim;
                bodyj.vz += dz * bim;
            }

            bodyi.vx = bivx;
            bodyi.vy = bivy;
            bodyi.vz = bivz;

            bodyi.x += dt * bivx;
            bodyi.y += dt * bivy;
            bodyi.z += dt * bivz;
        }
    }

    energy(): number {
        "use speedyjs";
        let e = 0.0;

        for (let i = 0; i < this.bodies.length; ++i) {
            const bodyi: Body = this.bodies[i];
            e += 0.5 * bodyi.mass * (Math.pow(bodyi.vx, 2) + Math.pow(bodyi.vy, 2) + Math.pow(bodyi.vz, 2));

            for (let j = i + 1; j < this.bodies.length; ++j) {
                const bodyj = this.bodies[j];
                const dx = bodyi.x - bodyj.x;
                const dy = bodyi.y - bodyj.y;
                const dz = bodyi.z - bodyj.z;

                const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
                e -= bodyi.mass * bodyj.mass / distance;
            }
        }
        return e;
    }
}

export async function nbody(n: int) {
    "use speedyjs";

    const bodies: NBodySystem = new NBodySystem([Sun(), Jupiter(), Saturn(), Uranus(), Neptune()]);
    for (let i = 0; i < n; i++) {
        bodies.advance(0.01);
    }

    return bodies.energy();
}
