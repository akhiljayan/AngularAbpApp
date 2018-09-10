(function () {
    appModule.filter('formatFileSize', function () {
        return function (bytes) {
            if (bytes == 0) return '0 bytes';
            var k = 1024,
                sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
                i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    });
})();