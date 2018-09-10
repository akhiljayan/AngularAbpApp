(function () {    

    appModule.controller('tenant.views.dashboard.moments',
        ['$scope', '$timeout', 'abp.services.app.post', '$uibModal', 'FileUploader', 'abp.services.app.commonLookup',
            function ($scope, $timeout, momentPostService, $uibModal, fileUploader, commonLookup) {
                var vm = this;
                vm.appPath = abp.appPath;
                vm.momentPostCard = {};
                vm.momentPostCard = { filterText: "", skipCount: 0, maxResultCount: 3, incrementCount: 3, currentTotal: 3 };
                vm.momentPostCard.Posts = [];
                vm.uploadedFileName = null;
                //init();

                vm.permissions = {
                    create: abp.auth.hasPermission('Pages.Tenant.Moments.Create'),
                    edit: abp.auth.hasPermission('Pages.Tenant.Moments.Edit'),
                    view: abp.auth.hasPermission('Pages.Tenant.Moments.View'),
                    like: abp.auth.hasPermission('Pages.Tenant.Moments.Like')
                };

                vm.momentPostCard.getNewPostObject = function () {
                    var post = { Description: "", Hashtags: [], PersonTags: [] };
                    return post;
                }

                vm.momentPostCard.getNewHasTagObject = function () {
                    var hashTag = { id: "00000000-0000-0000-0000-000000000000", name: "" };
                    return hashTag;
                }

                vm.momentPostCard.getNewPersonTagObject = function () {
                    var personTag = { postId: "00000000-0000-0000-0000-000000000000", person: { id: "" } };
                    return personTag;
                }


                vm.momentPostCard.refreshGrid = function () {
                    var prms = {
                        skipCount: 0,
                        maxResultCount: vm.momentPostCard.currentTotal,
                        filter: vm.momentPostCard.filterText
                    };
                    momentPostService.getPosts(prms).then(function (result) {
                        vm.momentPostCard.Posts = result.data.items;
                    }).finally(function () {
                    });
                }

                vm.momentPostCard.loadMore = function () {
                    vm.momentPostCard.skipCount = vm.momentPostCard.skipCount + vm.momentPostCard.maxResultCount;
                    vm.momentPostCard.maxResultCount = vm.momentPostCard.incrementCount;
                    vm.momentPostCard.currentTotal = vm.momentPostCard.maxResultCount + vm.momentPostCard.skipCount;
                    var prms = {
                        skipCount: vm.momentPostCard.skipCount,
                        maxResultCount: vm.momentPostCard.maxResultCount,
                        filter: vm.momentPostCard.filterText
                    };
                    momentPostService.getPosts(prms).then(function (result) {
                        for (var index in result.data.items) {
                            vm.momentPostCard.Posts.push(result.data.items[index]);
                        }
                        if (result.data.items && result.data.items.length == 0) {
                            abp.notify.info(app.localize('No more posts'));
                        }
                    }).finally(function () {
                    });
                }

                vm.momentPostCard.search = function (searchText) {
                    vm.momentPostCard.filterText = searchText;
                    var prms = {
                        skipCount: 0,
                        maxResultCount: vm.momentPostCard.currentTotal,
                        filter: searchText
                    };
                    momentPostService.getPosts(prms).then(function (result) {
                        vm.momentPostCard.Posts = result.data.items;
                    }).finally(function () {
                    });
                }

                vm.momentPostCard.getTwoPersonTags = function (post) {
                    var names = [];
                    for (var i = 0; i < post.personTags.length; i++) {
                        names.push(post.personTags[i].person.name);
                    }

                    return names.join(",");
                }

                vm.momentPostCard.containsPersons = function (post) {
                    return post.personTags.length > 0;
                }


                vm.momentPostCard.createPost = function () {
                    if (!$('#momentsForm').valid())
                        return

                    var post = vm.momentPostCard.getPostFromForm();
                    vm.uploadedFileName && post.attachments.push({
                        fileName: vm.uploadedFileName
                    });
                    momentPostService.createPost(post).then(function () {
                        abp.notify.info(app.localize('PostedSuccessfully'));
                    }).finally(function () {
                        vm.momentPostCard.refreshGrid();
                        clearForm();
                    });
                }

                vm.momentPostCard.deletePost = function (postId) {
                    abp.message.confirm(
                        app.localize('DeletePost'),
                        function (isConfirmed) {
                            if (isConfirmed) {
                                momentPostService.deletePost({ Id: postId }).then(function (result) {
                                    abp.notify.info(app.localize('PostDeletedSuccessfully'));
                                }).finally(function () {
                                    vm.momentPostCard.refreshGrid();
                                });
                            }
                        }
                    );

                }

                function clearForm() {
                    $('#momentPostActions').hide();
                    $('#addPhotoContainer').hide();
                    $('#addPersonContainer').hide();
                    $('#hashTagContainer').hide();
                    $('.postBoxContainer img, .cameraIcon').show();

                    $('#momentsForm').trigger("reset");
                    $("#hashTag").tagsinput('removeAll');
                    $("#person").tagsinput('removeAll');

                    vm.momentPostCard.postDescription = "";
                }

                vm.momentPostCard.getPostFromForm = function () {
                    var post = vm.momentPostCard.getNewPostObject();
                    post.Description = vm.momentPostCard.postDescription;
                    post.attachments = [];
                    var hashTags = $("#hashTag").tagsinput('items');
                    for (var tag in hashTags) {
                        var tagObject = vm.momentPostCard.getNewHasTagObject();
                        tagObject.name = hashTags[tag];
                        post.Hashtags.push(tagObject);
                    }
                    var personTags = $("#person").tagsinput('items');
                    for (var tag in personTags) {
                        var tagObject = vm.momentPostCard.getNewPersonTagObject();
                        tagObject.person.id = personTags[tag].value;
                        post.PersonTags.push(tagObject);
                    }

                    return post;
                }

                vm.momentPostCard.like = function (post) {
                    momentPostService.like({
                        postId: post.id
                    }).then(function (result) {
                        post.likeCount = result.data.likeCount;
                        post.hasLikedThisPost = result.data.hasLikedThisPost;
                    });
                };

                vm.uploader = new fileUploader({
                    url: abp.appPath + 'Post/UploadPhoto',
                    headers: {
                        "X-XSRF-TOKEN": abp.security.antiForgery.getToken()
                    },
                    queueLimit: 1,
                    autoUpload: true,
                    removeAfterUpload: true,
                    filters: [{
                        name: 'imageFilter',
                        fn: function (item, options) {
                            //File type check
                            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                            if ('|jpg|jpeg|png|gif|'.indexOf(type) === -1) {
                                abp.message.warn(app.localize('ProfilePicture_Warn_FileType'));
                                return false;
                            }

                            return true;
                        }
                    }]
                });

                vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                    if (response.success) {
                        vm.uploadedFileName = response.result.fileName;
                    } else {
                        abp.message.error(response.error.message);
                    }
                };

                vm.momentPostCard.init = function () {
                    vm.momentPostCard.refreshGrid();
                }

                vm.momentPostCard.init();

                vm.momentPostCard.editPost = function (id) {
                    openEditPost(id);
                }

                function openEditPost(id) {
                    var modalInstance = $uibModal.open({
                        windowTemplateUrl: '~/App/common/views/template/window.cshtml',
                        templateUrl: '~/App/tenant/views/dashboard/Moments/Posts/editMomentPost.cshtml',
                        controller: 'tenant.views.dashboard.editMomentPost as vm',
                        backdrop: 'static',
                        backdropClass: 'backdropColor-Remove',
                        windowClass: 'draggableModal',
                        openedClass: 'dragModal',
                        resolve: {
                            postId: function () {
                                return id;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        vm.momentPostCard.refreshGrid();
                    });

                }

                //function init() {
                //    commonLookup.lookUpUsersExceptCurrentLoggedIn({ tenantId: abp.session.tenantId }).then(function (result) {
                //        console.log(result.data.items);
                //        vm.users = result.data.items;
                //    });
                //}


                $scope.$watch('$viewContentLoaded', bindJqueryEvents);

                function bindJqueryEvents() {
                    $timeout(function () {
                        $('#momentsForm').ValidateControls({
                            rules: {
                                PostMessage: {
                                    required: true
                                }
                            }
                        });
                        $('#postHelpText').click(function () {
                            $('#momentPostActions').show();
                        });

                        $('#momentPostCancel').click(function () {
                            $('#momentPostActions').hide();
                            $('#addPhotoContainer').hide();
                            $('#addPersonContainer').hide();
                            $('#hashTagContainer').hide();
                            $('.postBoxContainer img, .cameraIcon').show();
                            clearPostForm();
                        });

                        $('.postBoxContainer img, .cameraIcon').on('click', function () {
                            $('#addPhotoContainer').show();
                            $('#addPersonContainer').show();
                            $('#hashTagContainer').show();
                            $('#momentPostActions').show();
                            $('.postBoxContainer img, .cameraIcon').hide();
                        });

                        function clearPostForm() {
                            $('#momentsForm').trigger("reset");
                            $("#hashTag").tagsinput('removeAll');
                            $("#person").tagsinput('removeAll');
                        }

                        $("#hashTag").tagsinput('items');

                        $("#person").MakeAsTagsInputWithAutoComplete({
                            remoteUrl: "api/services/app/commonLookup/LookUpUsersNameExceptCurrentLoggedIn",
                            itemText: "name",
                            itemValue: "value"
                        });
                    }, 0);
            }
            
        }
        ]);

    appModule.directive('postTitle', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            controller: 'tenant.views.dashboard.moments', //Embed a custom controller in the directive
            link: function (scope, element, attrs) {
                var userName = scope.post.userName;
                var personTags = scope.post.personTags;
                var containsImage = scope.post.attachments.length > 0;
                var persons = [];
                var personNames;
                var html;
                var personNameHtml;
                for (var index in personTags) {
                    persons.push('<a>' + personTags[index].person.name + '</a>');
                }
                var userCaption = '{{ post.userName }}';
                var postAddage = ' <span class="caption-helper">added picture</span>';
                var postAddageNoMedia = ' <span class="caption-helper">tagged</span>';
                var postTagWithPicture = '<span class="caption-helper">with</span>';
                var space = " ";
                if (persons.length > 0) {
                    personNames = persons.join(", ");
                    var replacement = ' <span class="caption-helper">and</span> ';
                    personNames = personNames.replace(/,([^,]*)$/, replacement + '$1');                    
                   
                    if (containsImage) {
                        html = '<span class="caption">' + userCaption + '</span>' + postAddage + space + postTagWithPicture + space +  personNames;
                    }
                    else {
                        html = '<span class="caption">' + userCaption + '</span>' + postAddageNoMedia + space + personNames;
                    }
                }
                else {
                    if (containsImage) {
                        html = '<span class="caption">' + userCaption + '</span>' + postAddage + space + postTagWithPicture;
                    }
                    else {
                        html = '<span class="caption">' + userCaption  + '</span>';
                    }
                }
                var el = $compile(html)(scope);
                element.append(el);


            } //DOM manipulation
        }
    }]);
})();