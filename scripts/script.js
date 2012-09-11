$(document).ready(function(){
    draw();
});

function draw(){
    var canvas = document.getElementById('c');
    //You can change the width and height
    canvas.width = 400;
    canvas.height = 400;

    if(!canvas.getContext){
        alert('Your browser don\'t support canvas!');
    }else{
        clock(canvas);
        //starts here
    }

    function clock(canvas){
        var ctx = canvas.getContext('2d');

        //背景色
        ctx.fillStyle = '#E6E4E5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //更改坐标系到中间
        ctx.translate(canvas.width*0.5, canvas.height*0.5);

        //画底部阴影
        var bottom_shadow = ctx.createRadialGradient(0, 280, 100, 0, 280, 200 );
        bottom_shadow.addColorStop(0, 'rgba(0, 0, 0, 255)');
        bottom_shadow.addColorStop(0.4, 'rgba(150, 150, 150, 200)');
        bottom_shadow.addColorStop(0.9, '#E6E4E5');
        ctx.fillStyle = bottom_shadow;
        ctx.beginPath();
        ctx.arc(0, 280, 200, Math.PI*0.8, Math.PI*0.2, false);
        ctx.fill();

        //底部桌面
        var bottom_blank = 18;
        ctx.fillStyle = '#DFDFDF';
        ctx.fillRect(-canvas.width*0.5, canvas.height*0.5-bottom_blank, canvas.width, bottom_blank);

        //白色外框
        var frame_width = 18;
        var inner_radius = 165;
        ctx.beginPath();
        ctx.strokeStyle = '#FBFAF6';
        ctx.lineWidth = frame_width;
        ctx.arc(0, 0, inner_radius + frame_width*0.5, 0, Math.PI*2, true);
        ctx.stroke();

        //黑色内线
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.arc(0, 0, inner_radius + 2, 0, Math.PI*2, true);
        ctx.stroke();

        //白色内遮罩
        ctx.beginPath();
        ctx.arc(0, 0, inner_radius, 0, Math.PI*2, true);
        ctx.clip();

        setInterval(function(){time_animate(ctx);}, 1000);
    }

    //时针函数
    function get_hand_angle(h, m, s){
        if(h>12)
            h -= 12;
        var h_angle = (h/6 + m/360 + s/21600) * Math.PI;
        var m_angle = (m/30 + s/1800) * Math.PI;
        var s_angle = s/30 * Math.PI;
        return {
            'h' : h_angle,
            'm' : m_angle,
            's' : s_angle
        }
    }

    function time_animate(ctx){
        ctx.save();

        ctx.clearRect(-200, -200, 400, 400);
        var inner_radius = 165;

        //图案背景
        ctx.beginPath();
        var img = new Image();
        img.src = 'point.jpg';
        var bg = ctx.createPattern(img, 'repeat');
        ctx.fillStyle = bg;
        ctx.arc(0, 0, inner_radius, 0, Math.PI*2, true);
        ctx.fill();

        if(window.ActiveXObject){ //IE HACK
            for(var i=-200; i<400; i+=70){
                for(var j=-200; j<400; j+=70)
                    ctx.drawImage(img, i, j);
            }

            ctx.beginPath();
            ctx.strokeStyle = '#eee';
            ctx.lineWidth = 300;
            ctx.arc(0, 0, 315, 0, Math.PI*2, true);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.arc(0, 0, 166, 0, Math.PI*2, true);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 17;
            ctx.arc(0, 0, 175, 0, Math.PI*2, true);
            ctx.stroke();
        }

        //数字
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var font_radius = 135;
        //var font_family = '華康少女文字W6';  //只有opera能用
        var font_family = 'girl';
        for(var angle=Math.PI/6,i=1; i<13; angle += Math.PI/6, i++){
            if(i%3 == 0){
                font_radius = 130;
                ctx.font = '65px ' + font_family;
            }else{
                ctx.font = 'bold 30px ' + font_family; 
                font_radius = 135;
            }
            //ctx.fillText(i.toString(), font_radius*Math.sin(angle)-5, -font_radius*Math.cos(angle)-4);//中文少女体微调数字位置
            ctx.fillText(i.toString(), font_radius*Math.sin(angle), -font_radius*Math.cos(angle));
        }

        //内阴影
        if(!window.ActiveXObject){ //NOT IE
            ctx.translate(10, -10);
            var inner_shadow = ctx.createRadialGradient(0, 0, 140, 0, 0, 230);
            inner_shadow.addColorStop(0.1, 'rgba(0, 0, 0, 0)');
            inner_shadow.addColorStop(0.2, 'rgba(0, 0, 0, 0.1)');
            inner_shadow.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
            ctx.beginPath();
            ctx.fillStyle = inner_shadow;
            ctx.arc(0, 0, 230, 0, Math.PI*2, true);
            ctx.fill();
        }

        var now = new Date();

        //显示指针
        var time = get_hand_angle(now.getHours(), now.getMinutes(), now.getSeconds());
        var h_width = 130, h_height = 7;
        var m_width = 150, m_height = 4;
        var s_width = 170, s_height = 2;
        var outside_width = 35;

        ctx.shadowOffsetX = 6;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#aaa';
        ctx.fillStyle = '#000';
        ctx.rotate(time.h);
        ctx.fillRect(-h_height*0.5, -h_width+outside_width, h_height, h_width);
        ctx.rotate(time.m-time.h);
        ctx.fillRect(-m_height*0.5, -m_width+outside_width, m_height, m_width);
        ctx.rotate(time.s-time.m);
        ctx.fillRect(-s_height*0.5, -s_width+outside_width, s_height, s_width);
        ctx.rotate(-time.s);

        ctx.shadowColor = 'rgba(0, 0, 0, 0)';

        //重画一次时针，解决阴影覆盖本身的指针
        ctx.rotate(time.h);
        ctx.fillRect(-h_height*0.5, -h_width+outside_width, h_height, h_width);

        //中间的固定圈
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.arc(0, 0, 6, 0, Math.PI*2, true);
        ctx.stroke();

        ctx.restore();
    }
}

