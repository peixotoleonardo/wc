defmodule WcTest do
  use ExUnit.Case
  doctest Wc

  test "greets the world" do
    assert Wc.hello() == :world
  end
end
