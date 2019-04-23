define([
    'core/js/adapt',
    'core/js/views/menuView'
], function(Adapt, MenuView) {

    var StartNewMenuView = MenuView.extend({

        className: function() {
            return MenuView.prototype.className.apply(this) + " startnewmenu-menu";
        },

        attributes: function() {
            return MenuView.prototype.resultExtend('attributes', {
                'role': 'main',
                'aria-labelledby': this.model.get('_id')+'-heading'
            }, this);
        },

        postRender: function() {
            var nthChild = 0;
            this.model.getChildren().each(function(item) {
                if (item.get('_isAvailable') && !item.get('_isHidden')) {
                    item.set('_nthChild', ++nthChild);
                    this.$('.js-children').append(new StartNewMenuItemView({model: item}).$el);
                }

                if(item.get('_isHidden')) {
                    item.set('_isReady', true);
                }
            });
        }

    }, {
        template: 'startnewmenu'
    });

    var StartNewMenuItemView = MenuView.extend({

        events: {
            'click button' : 'onClickMenuItemButton'
        },

        attributes: function() {
            return MenuView.prototype.resultExtend('attributes', {
                'role': 'listitem',
                'aria-labelledby': this.model.get('_id') + '-heading'
            }, this);
        },

        className: function() {
            var nthChild = this.model.get('_nthChild');
            return [
                'menu-item',
                'menu-item-' + this.model.get('_id') ,
                this.model.get('_classes'),
                this.model.get('_isVisited') ? 'visited' : '',
                this.model.get('_isComplete') ? 'completed' : '',
                this.model.get('_isLocked') ? 'locked' : '',
                'nth-child-' + nthChild,
                nthChild % 2 === 0 ? 'nth-child-even' : 'nth-child-odd'
            ].join(' ');
        },

        preRender: function() {
            this.model.checkCompletionStatus();
            this.model.checkInteractionCompletionStatus();
        },

        postRender: function() {
            var graphic = this.model.get('_graphic');
            if (graphic && graphic.src) {
                this.$el.imageready(this.setReadyStatus.bind(this));
                return;
            }

            this.setReadyStatus();
        },

        onClickMenuItemButton: function(event) {
            if(event && event.preventDefault) event.preventDefault();
            if(this.model.get('_isLocked')) return;
            Backbone.history.navigate('#/id/' + this.model.get('_id'), {trigger: true});
        }

    }, {
        template: 'startnewmenu-item'
    });

    Adapt.on('router:menu', function(model) {

        $('#wrapper').append(new StartNewMenuView({model: model}).$el);

    });

});
