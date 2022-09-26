module Jekyll
    module GetSetFilter
        def get(input, key)
            input[key]
        end
        def set(input, key, value = "".freeze)
            puts "set: #{key} = #{value}"
            input2 = input.dup
            input2[key] = value
            input2
        end
    end
    module FormatDateFilter
        def strptime(input, fmt)
            Date.strptime(input, fmt)
        end
        def strftime(input, fmt)
            input.strftime(fmt)
        end
    end
end

Liquid::Template.register_filter(Jekyll::GetSetFilter)
Liquid::Template.register_filter(Jekyll::FormatDateFilter)