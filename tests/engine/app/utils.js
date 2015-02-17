function lerp(from, to, amount){
	return to - (to - from) * Math.abs(amount);
}

function lerpInt(from, to, amount){
	return parseInt(to - (to - from) * Math.abs(amount));
}

function toRGB(c){
	return {
		r: c >> 16 & 0xff,
		g: c >> 8 & 0xff,
		b: c & 0xff
	};
}

//this.background.rotation = Math.sin(this.angle * 5) * 0.03;
function color_lerp(from, to, angle){
	var c1 = toRGB(from);
	var c2 = toRGB(to);
	//console.log(from, c1);
	amount = Math.sin(angle);
	
	var r = lerpInt(c1.r, c2.r, amount);
	var g = lerpInt(c1.g, c2.g, amount);
	var b = lerpInt(c1.b, c2.b, amount);
	
	//throw "fucked";
	return (r << 16) + (g << 8) + b;
}

//Physics globals
window.b2Vec2 = Box2D.Common.Math.b2Vec2;
window.b2BodyDef = Box2D.Dynamics.b2BodyDef;
window.b2Body = Box2D.Dynamics.b2Body;
window.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
window.b2Fixture = Box2D.Dynamics.b2Fixture;
window.b2World = Box2D.Dynamics.b2World;
window.b2MassData = Box2D.Collision.Shapes.b2MassData;
window.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
window.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
window.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;