//当用户点击登陆按钮的时候，这个插件ajaxForm方法会自动监听submit时间
//然后阻止浏览器默认的刷新提交，然后自动变成ajax的方式发送请求
$('#login-form').ajaxForm({
    success: function(data) {
        if (data.code == 200) {
            alert('登陆成功');
            location.href = '/dist';
        } else {
            alert('登陆失败');
        }
    },
    error: function() {
        alert('登陆失败');
    }
});