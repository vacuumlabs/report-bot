Bundler.require :default

require 'asciidoctor'
require 'fileutils'

guard 'shell' do
  watch(/^.*\.adoc$/) {|m|
    FileUtils.cp_r 'assets', 'dist', :verbose => true
    Asciidoctor.convert_file 'src/index.adoc', header_footer: true, safe: :safe, to_dir: 'dist'
  }
end
