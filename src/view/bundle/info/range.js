module.exports = function($scope, $state, $http, $q) {
    console.log($state)
    $scope.parent_sref = $state.current.name.replace(/.range/g, '');

    $scope.range = {
        step: 'industry',
        parents: [],
        sub_item: {
            parent_id: '',
            children: []
        },

        industries: [],
        posts: [],
        experiences: [],

        current_item: {
            id: '',
            parent_id: ''
        },
        selected_industry: {
            parent_id: '',
            id: '',
            name: '请选择行业'
        },
        selected_post: {
            id: '',
            name: '请选择岗位'
        },
        selected_experience: {
            id: '',
            name: '请选择工作年限'
        }
    }

    $scope.init = function() {

        $http.get('/scope/industry').then(function(xhr) {
            console.log(xhr.data.items);
            xhr.data.items = xhr.data.items || [];
            xhr.data.items.unshift({
                id: -99,
                name: '通用'
            });

            $scope.range.industries = xhr.data.items;

            if ($scope.data.attribute.industry_name) {
                $scope.range.selected_industry.id = $scope.data.attribute.industry_id || -99;
                $scope.range.selected_industry.name = $scope.data.attribute.industry_name || '通用';
            }
            if ($scope.data.attribute.post_name) {
                $scope.range.selected_post.id = $scope.data.attribute.post_id || -99;
                $scope.range.selected_post.name = $scope.data.attribute.post_name || '不限';
            }
            if ($scope.data.attribute.experience_name) {
                $scope.range.selected_experience.id = $scope.data.attribute.experience_id || -99;
                $scope.range.selected_experience.name = $scope.data.attribute.experience_name || '不限';
            }

            renderParent();
            industryDefault();
            expandIndustry();
        }, function(xhr) {
            // console.log(xhr);
            // console.log(xhr);
        });
    }

    $scope.pre = function() {
        switch ($scope.range.step) {
            case 'industry':
                $scope.range.step = 'post';
                break;
            case 'post':
                $scope.range.step = 'industry';
                break;
            case 'experience':
                $scope.range.step = 'post';
                break;

        }
        renderParent();
        expandIndustry();
    }

    $scope.next = function() {
        switch ($scope.range.step) {
            case 'industry':
                if ($scope.range.selected_industry.id == '') {
                    showErrTip('industry');
                    return;
                }
                $scope.range.step = 'post';
                getPosts();
                break;
            case 'post':
                if ($scope.range.selected_post.id == '') {
                    showErrTip('post');
                    return;
                }
                $scope.range.step = 'experience';
                getExperiences();
                break;
            case 'experience':
                break;

        }
        // renderParent();
        // expandIndustry();
    }

    $scope.mouseover = function(item, e) {
        $('.label').removeClass('on');
        $('.range-pop').css('visibility', 'hidden');

        if (!item.children || !item.children.length) {
            $scope.range.sub_items = {
                parent_id: '',
                children: []
            }
            return;
        }

        $scope.range.sub_items = {
            parent_id: item.id,
            children: item.children
        }
        $(e.target).addClass('on');
        $('.range-pop').css('visibility', 'visible');
    }

    $scope.selectRange = function(item, e) {
        switch ($scope.range.step) {
            case 'industry':
                $scope.range.selected_industry.parent_id = $scope.range.sub_items.parent_id || item.id;
                $scope.range.selected_industry.id = item.id;
                $scope.range.selected_industry.name = item.name;
                $('li[data-range="industry"]').removeClass("n-err").css("animation", "");
                break;
            case 'post':
                $scope.range.selected_post.id = item.id;
                $scope.range.selected_post.name = item.name;
                $('li[data-range="post"]').removeClass("n-err").css("animation", "");
                break;
            case 'experience':
                $scope.range.selected_experience.id = item.id;
                $scope.range.selected_experience.name = item.name;
                $('li[data-range="experience"]').removeClass("n-err").css("animation", "");
                break;
        }
        $scope.range.current_item = {
            parent_id: $scope.range.sub_items.parent_id || item.id,
            id: item.id
        }
    }

    $scope.done = function() {
        if (!$scope.range.selected_experience.id) {
            showErrTip('experience');
            return;
        }

        $scope.$emit('rangeDone', {
            industry_id: $scope.range.selected_industry.id,
            industry_name: $scope.range.selected_industry.name,
            post_id: $scope.range.selected_post.id,
            post_name: $scope.range.selected_post.name,
            experience_id: $scope.range.selected_experience.id,
            experience_name: $scope.range.selected_experience.name
        });

        $state.go('^');
    }

    function showErrTip(attr) {
        $('li[data-range="' + attr + '"]').removeClass('n-err').css('animation', '');
        setTimeout(function() {
            $('li[data-range="' + attr + '"]').addClass('n-err').css('animation', 'n-err 3s ease 1');
        }, 100);
    }

    function renderParent() {
        $scope.range.children = [];
        $('.label').removeClass('on');
        $('.range-pop').css('visibility', 'hidden');
        switch ($scope.range.step) {
            case 'industry':
                $scope.range.parents = $scope.range.industries;
                $scope.range.current_item = {
                    parent_id: $scope.range.selected_industry.parent_id,
                    id: $scope.range.selected_industry.id
                }
                break;
            case 'post':
                $scope.range.parents = $scope.range.posts;
                $scope.range.current_item = {
                    parent_id: $scope.range.selected_post.id,
                    id: $scope.range.selected_post.id
                }
                break;
            case 'experience':
                $scope.range.parents = $scope.range.experiences;
                $scope.range.current_item = {
                    parent_id: $scope.range.selected_experience.id,
                    id: $scope.range.selected_experience.id
                }
                break;
        }
    }

    function getPosts() {
        $http({
            method: 'GET',
            url: '/scope/post',
            params: {
                industry_id: $scope.range.selected_industry.id
            }
        }).then(function(xhr) {
            console.log(xhr.data.items)

            xhr.data.items = xhr.data.items || [];
            xhr.data.items.unshift({
                id: -99,
                name: '不限'
            });

            $scope.range.posts = xhr.data.items;

            renderParent();
            expandIndustry();

        }, function(xhr) {
            console.log(xhr);
            console.log(xhr);
        });
    }

    function getExperiences() {
        if ($scope.range.experiences.length) {
            renderParent();
            expandIndustry();

            return;
        }

        $http.get('/scope/experience').then(function(xhr) {
            console.log(xhr.data.items)

            xhr.data.items = xhr.data.items || [];
            xhr.data.items.unshift({
                id: -99,
                name: '不限'
            });

            $scope.range.experiences = xhr.data.items;

            renderParent();
            expandIndustry();

        }, function(xhr) {
            console.log(xhr);
            console.log(xhr);
        });
    }

    function industryDefault() {
        if ($scope.range.step != 'industry') {
            return;
        }
        if (!$scope.range.current_item.id) {
            return;
        }
        if (!$scope.range.industries.length) {
            return;
        }

        for (var i = 0, max = $scope.range.industries.length; i < max; i++) {
            var industry = $scope.range.industries[i];
            if (industry.id == $scope.range.current_item.id) {
                $scope.range.current_item.parent_id = industry.id;
                break;
            }

            industry.children = industry.children || [];
            if (industry.children.length) {
                for (var j = 0, m = industry.children.length; j < m; j++) {
                    var child = industry.children[j];
                    if (child.id == $scope.range.current_item.id) {
                        $scope.range.current_item.parent_id = industry.id;
                        break;
                    }
                }
            }
            if ($scope.range.current_item.parent_id) {
                $scope.range.selected_industry.parent_id = $scope.range.current_item.parent_id;
                break;
            }
        }
    }

    function expandIndustry() {
        if ($scope.range.step != 'industry') {
            return;
        }

        if ($scope.range.current_item.parent_id == $scope.range.current_item.id) {
            return;
        }

        $('.label').removeClass('on');
        $('.range-pop').css('visibility', 'hidden');

        var mapItems = $.grep($scope.range.industries, function(item, i) {
            return item.id == $scope.range.current_item.parent_id;
        });
        if (!mapItems.length) {
            return;
        }
        var mapItem = mapItems[0]
        $scope.range.sub_items = {
            parent_id: mapItem.id,
            children: mapItem.children
        }
        $('.range-pop').css('visibility', 'visible');
    }
};
